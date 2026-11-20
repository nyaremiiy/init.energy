import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCalculatorLeadData } from "./calculator-lead.ts";

const values = [
  ["segment", "house"],
  ["goal", "both"],
  ["monthlyKwh", 450],
  ["region", "lvivska"],
  ["backupHours", 8],
];
const all = () => true;
const recommendation = { configuration: "СЕС 5 кВт + накопичувач SVIT HOME" };

test("nothing changed → nothing is attached", () => {
  assert.equal(
    buildCalculatorLeadData({ calculator: "quick", values, applicable: all, changed: new Set(), recommendation }),
    null,
  );
});

test("only the segment changed → selected has the segment, the rest is assumed", () => {
  const data = buildCalculatorLeadData({
    calculator: "quick",
    values: [["segment", "apartment"], ...values.slice(1)],
    applicable: all,
    changed: new Set(["segment"]),
    recommendation,
  });
  assert.deepEqual(data.changedFields, ["segment"]);
  assert.deepEqual(data.selected, { segment: "apartment" });
  assert.deepEqual(data.assumed, { goal: "both", monthlyKwh: 450, region: "lvivska", backupHours: 8 });
  assert.equal(data.calculator, "quick");
  assert.equal(data.recommendation, recommendation);
});

test("fields that do not apply to the goal are left out entirely", () => {
  // Backup only: no region, even though the visitor had changed it before switching the goal.
  const data = buildCalculatorLeadData({
    calculator: "quick",
    values,
    applicable: (field) => field !== "region",
    changed: new Set(["goal", "region"]),
    recommendation,
  });
  assert.deepEqual(data.changedFields, ["goal"]);
  assert.ok(!("region" in data.selected));
  assert.ok(!("region" in data.assumed));
});

test("a field returned to its default still counts as chosen", () => {
  const data = buildCalculatorLeadData({ calculator: "quick", values, applicable: all, changed: new Set(["monthlyKwh"]), recommendation });
  assert.deepEqual(data.selected, { monthlyKwh: 450 });
});

test("empty optional fields are not assumed; ?type= is kept as a source", () => {
  const data = buildCalculatorLeadData({
    calculator: "ses-payback",
    values: [["objectType", "business"], ["budget", undefined], ["roofArea", undefined]],
    applicable: all,
    changed: new Set(["objectType"]),
    sources: { objectType: "url" },
    recommendation: {},
  });
  assert.deepEqual(data.selected, { objectType: "business" });
  assert.deepEqual(data.assumed, {});
  assert.deepEqual(data.sources, { objectType: "url" });
});
