import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

type TokenKind = "client" | "code" | "access" | "refresh";

interface SignedPayload {
  kind: TokenKind;
  iat: number;
  exp: number;
  jti: string;
  [key: string]: unknown;
}

export interface OAuthClientPayload extends SignedPayload {
  kind: "client";
  redirectUris: string[];
}

export interface AuthorizationCodePayload extends SignedPayload {
  kind: "code";
  clientId: string;
  redirectUri: string;
  resource: string;
  scope: string;
  codeChallenge: string;
}

export interface AccessTokenPayload extends SignedPayload {
  kind: "access";
  clientId: string;
  resource: string;
  scope: string;
}

export interface RefreshTokenPayload extends SignedPayload {
  kind: "refresh";
  clientId: string;
  resource: string;
  scope: string;
}

const CHATGPT_REDIRECT = /^https:\/\/chatgpt\.com\/connector\/oauth\/[A-Za-z0-9_-]+$/;
const LEGACY_REDIRECT = "https://chatgpt.com/connector_platform_oauth_redirect";

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export class OAuthService {
  private readonly usedCodes = new Map<string, number>();
  readonly issuer: string;
  readonly resource: string;

  constructor(baseUrl: string, private readonly signingKey: string) {
    this.issuer = baseUrl.replace(/\/$/, "");
    this.resource = `${this.issuer}/mcp`;
  }

  metadata() {
    return {
      issuer: this.issuer,
      authorization_endpoint: `${this.issuer}/oauth/authorize`,
      token_endpoint: `${this.issuer}/oauth/token`,
      registration_endpoint: `${this.issuer}/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: ["lovense:control"],
    };
  }

  protectedResourceMetadata() {
    return {
      resource: this.resource,
      authorization_servers: [this.issuer],
      scopes_supported: ["lovense:control"],
      resource_documentation: `${this.issuer}/`,
      bearer_methods_supported: ["header"],
    };
  }

  registerClient(redirectUris: unknown) {
    if (!Array.isArray(redirectUris) || redirectUris.length === 0 || redirectUris.length > 8) {
      throw new Error("redirect_uris must contain between 1 and 8 URLs.");
    }
    const validated = [...new Set(redirectUris.map(String))];
    if (validated.some((uri) => !this.isAllowedRedirect(uri))) {
      throw new Error("Only ChatGPT connector callback URLs are allowed.");
    }
    const now = Math.floor(Date.now() / 1000);
    const token = this.sign({ kind: "client", iat: now, exp: now + 365 * 24 * 3600, jti: randomUUID(), redirectUris: validated });
    return {
      client_id: `${this.issuer}/oauth/client/${token}`,
      client_id_issued_at: now,
      redirect_uris: validated,
      token_endpoint_auth_method: "none",
    };
  }

  validateAuthorization(input: Record<string, string>): OAuthClientPayload {
    if (input.response_type !== "code") throw new Error("Only response_type=code is supported.");
    if (input.code_challenge_method !== "S256" || !/^[A-Za-z0-9_-]{43,128}$/.test(input.code_challenge || "")) {
      throw new Error("PKCE with code_challenge_method=S256 is required.");
    }
    if (input.resource !== this.resource) throw new Error("The OAuth resource is not valid for this connector.");
    if (!input.scope?.split(/\s+/).includes("lovense:control")) throw new Error("The lovense:control scope is required.");
    const clientId = input.client_id || "";
    const redirectUri = input.redirect_uri || "";
    const client = this.verifyClient(clientId);
    if (!client.redirectUris.includes(redirectUri) || !this.isAllowedRedirect(redirectUri)) {
      throw new Error("The redirect URI is not registered.");
    }
    return client;
  }

  createAuthorizationCode(input: Record<string, string>): string {
    this.validateAuthorization(input);
    const now = Math.floor(Date.now() / 1000);
    return this.sign({
      kind: "code", iat: now, exp: now + 300, jti: randomUUID(),
      clientId: input.client_id!, redirectUri: input.redirect_uri!, resource: input.resource!,
      scope: input.scope!, codeChallenge: input.code_challenge!,
    });
  }

  exchangeCode(input: Record<string, string>) {
    if (input.grant_type !== "authorization_code") throw new Error("Invalid grant_type.");
    const code = this.verify<AuthorizationCodePayload>(input.code || "", "code");
    this.pruneUsedCodes();
    if (this.usedCodes.has(code.jti)) throw new Error("The authorization code was already used.");
    if (code.clientId !== input.client_id || code.redirectUri !== input.redirect_uri || code.resource !== input.resource) {
      throw new Error("The authorization code does not match this request.");
    }
    const expected = createHash("sha256").update(input.code_verifier || "", "utf8").digest("base64url");
    if (!safeEqual(expected, code.codeChallenge)) throw new Error("PKCE verification failed.");
    this.verifyClient(input.client_id || "");
    this.usedCodes.set(code.jti, code.exp);
    return this.issueTokens(code.clientId, code.resource, code.scope);
  }

  refresh(input: Record<string, string>) {
    if (input.grant_type !== "refresh_token") throw new Error("Invalid grant_type.");
    const refresh = this.verify<RefreshTokenPayload>(input.refresh_token || "", "refresh");
    if (refresh.clientId !== input.client_id || refresh.resource !== input.resource) {
      throw new Error("The refresh token does not match this request.");
    }
    this.verifyClient(input.client_id || "");
    return this.issueTokens(refresh.clientId, refresh.resource, refresh.scope);
  }

  verifyAccess(token: string): AccessTokenPayload {
    const payload = this.verify<AccessTokenPayload>(token, "access");
    if (payload.resource !== this.resource || !payload.scope.split(/\s+/).includes("lovense:control")) {
      throw new Error("The access token has the wrong audience or scope.");
    }
    return payload;
  }

  private issueTokens(clientId: string, resource: string, scope: string) {
    const now = Math.floor(Date.now() / 1000);
    const common = { clientId, resource, scope };
    return {
      access_token: this.sign({ kind: "access", iat: now, exp: now + 3600, jti: randomUUID(), ...common }),
      token_type: "Bearer",
      expires_in: 3600,
      scope,
      refresh_token: this.sign({ kind: "refresh", iat: now, exp: now + 30 * 24 * 3600, jti: randomUUID(), ...common }),
    };
  }

  private verifyClient(clientId: string): OAuthClientPayload {
    const prefix = `${this.issuer}/oauth/client/`;
    if (!clientId?.startsWith(prefix)) throw new Error("The OAuth client is not registered here.");
    return this.verify<OAuthClientPayload>(clientId.slice(prefix.length), "client");
  }

  private isAllowedRedirect(uri: string): boolean {
    return CHATGPT_REDIRECT.test(uri) || uri === LEGACY_REDIRECT;
  }

  private sign(payload: SignedPayload): string {
    const body = encode(payload);
    const signature = createHmac("sha256", this.signingKey).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  private verify<T extends SignedPayload>(token: string, kind: TokenKind): T {
    const [body, signature, extra] = String(token || "").split(".");
    if (!body || !signature || extra) throw new Error("Malformed OAuth token.");
    const expected = createHmac("sha256", this.signingKey).update(body).digest("base64url");
    if (!safeEqual(signature, expected)) throw new Error("Invalid OAuth token signature.");
    let payload: SignedPayload;
    try {
      payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SignedPayload;
    } catch {
      throw new Error("Malformed OAuth token payload.");
    }
    if (payload.kind !== kind || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error("OAuth token is expired or has the wrong type.");
    }
    return payload as T;
  }

  private pruneUsedCodes(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [jti, expires] of this.usedCodes) if (expires <= now) this.usedCodes.delete(jti);
  }
}
