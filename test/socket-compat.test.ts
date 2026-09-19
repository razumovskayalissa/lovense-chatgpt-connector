import assert from "node:assert/strict";
import test from "node:test";
import io from "socket.io-client";

test("the security-patched Socket.IO 2 client can parse Lovense socket URLs", () => {
  const socket = io("https://example.com:443?ntoken=abc%2Fdef&ch=1", {
    path: "/basicapi/v1",
    transports: ["websocket"],
    reconnection: false,
    forceNew: true,
  } as never);
  assert.equal(typeof socket.close, "function");
  const transportUri = ((socket as unknown as { io: { engine: { transport: { uri(): string } } } }).io.engine.transport).uri();
  const parsed = new URL(transportUri);
  assert.equal(parsed.origin, "wss://example.com");
  assert.equal(parsed.pathname, "/basicapi/v1/");
  assert.equal(parsed.searchParams.get("ntoken"), "abc/def");
  assert.equal(parsed.searchParams.get("ch"), "1");
  socket.close();
});
