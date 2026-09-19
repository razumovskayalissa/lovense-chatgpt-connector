import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { EncryptedStateStore } from "../src/state-store.js";

test("persists device state encrypted and rejects the wrong key", async () => {
  const directory = await mkdtemp(join(tmpdir(), "lilazul-lovense-test-"));
  const path = join(directory, "state.enc");
  try {
    const store = new EncryptedStateStore(path, "a very long encryption secret for tests");
    const state = {
      version: 1 as const,
      deviceInfo: {
        online: true, appType: "remote", appVersion: "7", platform: "ios", updatedAt: new Date().toISOString(),
        toys: [{ id: "private-device-id", name: "Ferri", toyType: "ferri", nickname: "mine", battery: 99, connected: true, capabilities: ["Vibrate" as const], capabilitySource: "catalog" as const }],
      },
    };
    await store.save(state);
    const raw = await readFile(path, "utf8");
    assert.equal(raw.includes("private-device-id"), false);
    assert.deepEqual(await store.load(), state);
    await assert.rejects(
      () => new EncryptedStateStore(path, "a different long encryption secret").load(),
      /Could not decrypt/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
