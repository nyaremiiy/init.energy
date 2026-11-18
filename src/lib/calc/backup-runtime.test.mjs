import assert from "node:assert/strict";
import { test } from "node:test";

import { exceedsOutput, roundHours, runtimeHours } from "./backup-runtime.ts";

const hours = (wh, w) => roundHours(runtimeHours(wh, w, 0.9));

test("backup runtime matches the owner's mockup (usable 90 %)", () => {
  // SVIT 600 (865 Wh), SVIT HOME (5.12 kWh), SVIT PLUS 16000 (16.07 kWh) × 168 / 318 / 1068 W.
  assert.equal(hours(865, 168), 4.6);
  assert.equal(hours(865, 318), 2.4);
  assert.equal(hours(5120, 168), 27);
  assert.equal(hours(5120, 318), 14.5);
  assert.equal(hours(5120, 1068), 4.3);
  assert.equal(hours(16070, 168), 86);
  assert.equal(hours(16070, 318), 45);
  assert.equal(hours(16070, 1068), 13.5);
});

test("output limit: SVIT 600 cannot run the 1068 W house set, a bare battery has no limit", () => {
  assert.equal(exceedsOutput(1068, 600), true);
  assert.equal(exceedsOutput(318, 600), false);
  assert.equal(exceedsOutput(1068, undefined), false);
});

test("no load means unlimited runtime", () => {
  assert.equal(runtimeHours(865, 0, 0.9), Number.POSITIVE_INFINITY);
});
