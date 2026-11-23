import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCalculatorSummary } from "./calculator-summary.ts";

test("all parts in order, one sentence", () => {
  assert.equal(
    buildCalculatorSummary(["СЕС 5 кВт", "накопичувач SVIT HOME", "резерв близько 15 год"]),
    "СЕС 5 кВт, накопичувач SVIT HOME, резерв близько 15 год.",
  );
});

test("parts without a value are skipped (backup goal: no plant)", () => {
  assert.equal(
    buildCalculatorSummary([undefined, "накопичувач SVIT 600", "резерв близько 8 год"]),
    "Накопичувач SVIT 600, резерв близько 8 год.",
  );
  assert.equal(buildCalculatorSummary(["Solar plant 10 kW", false, null, ""]), "Solar plant 10 kW.");
});

test("nothing to say → empty string", () => {
  assert.equal(buildCalculatorSummary([undefined, null]), "");
});
