import assert from "node:assert/strict";
import test from "node:test";
import { normalizeToy } from "../src/capabilities.js";

test("uses functions announced by the live device before the catalog", () => {
  const toy = normalizeToy({ id: "1", name: "Future Toy", status: 1, fullFunctionNames: ["Vibrate", "Suction"] });
  assert.deepEqual(toy?.capabilities, ["Vibrate", "Suction"]);
  assert.equal(toy?.capabilitySource, "device");
});

test("catalog fallback distinguishes Ferri, Nora and Vulse", () => {
  assert.deepEqual(normalizeToy({ id: "f", name: "Ferri", status: 1 })?.capabilities, ["Vibrate"]);
  assert.deepEqual(normalizeToy({ id: "n", name: "Nora", status: 1 })?.capabilities, ["Vibrate", "Rotate"]);
  assert.deepEqual(normalizeToy({ id: "v", name: "Vulse", status: 1 })?.capabilities, ["Vibrate", "Thrusting"]);
  assert.deepEqual(normalizeToy({ id: "b", name: "Velvo", status: 1 })?.capabilities, ["Vibrate", "Rotate", "Oscillate"]);
});

test("unknown devices stay explicit instead of inventing functions", () => {
  const toy = normalizeToy({ id: "x", name: "Unreleased Device", connected: true });
  assert.deepEqual(toy?.capabilities, []);
  assert.equal(toy?.capabilitySource, "unknown");
});
