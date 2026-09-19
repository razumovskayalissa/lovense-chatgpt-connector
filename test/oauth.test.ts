import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { OAuthService } from "../src/oauth.js";

test("OAuth uses ChatGPT-only redirects, PKCE, audience checks and one-time codes", () => {
  const oauth = new OAuthService("https://example.up.railway.app", "oauth signing secret long enough for secure tests");
  assert.throws(() => oauth.registerClient(["https://attacker.example/callback"]), /Only ChatGPT/);

  const redirectUri = "https://chatgpt.com/connector/oauth/example_callback";
  const registration = oauth.registerClient([redirectUri]);
  const verifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const auth = {
    response_type: "code",
    client_id: registration.client_id,
    redirect_uri: redirectUri,
    resource: oauth.resource,
    scope: "lovense:control",
    code_challenge: challenge,
    code_challenge_method: "S256",
  };
  const code = oauth.createAuthorizationCode(auth);
  const exchange = {
    grant_type: "authorization_code",
    code,
    client_id: registration.client_id,
    redirect_uri: redirectUri,
    resource: oauth.resource,
    code_verifier: verifier,
  };
  const tokens = oauth.exchangeCode(exchange);
  assert.equal(oauth.verifyAccess(tokens.access_token).resource, oauth.resource);
  assert.throws(() => oauth.exchangeCode(exchange), /already used/);

  const refreshed = oauth.refresh({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: registration.client_id,
    resource: oauth.resource,
  });
  assert.equal(oauth.verifyAccess(refreshed.access_token).scope, "lovense:control");
});

test("OAuth rejects a bad PKCE verifier", () => {
  const oauth = new OAuthService("https://example.up.railway.app", "another oauth signing secret long enough");
  const redirectUri = "https://chatgpt.com/connector/oauth/example_callback";
  const registration = oauth.registerClient([redirectUri]);
  const verifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  const code = oauth.createAuthorizationCode({
    response_type: "code", client_id: registration.client_id, redirect_uri: redirectUri,
    resource: oauth.resource, scope: "lovense:control",
    code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256",
  });
  assert.throws(() => oauth.exchangeCode({
    grant_type: "authorization_code", code, client_id: registration.client_id,
    redirect_uri: redirectUri, resource: oauth.resource, code_verifier: "wrong-verifier",
  }), /PKCE/);
});
