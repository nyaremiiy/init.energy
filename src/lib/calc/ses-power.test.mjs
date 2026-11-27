import assert from "node:assert/strict";
import { test } from "node:test";

import { average, roundMonth, roundYear, stationMonths, stationYear } from "./region-yield.ts";
import { fittingConsumption, fixedPlantEstimate, maxSavings, panelAreaM2, panelsForKw, panelsKwRange } from "./ses-power.ts";

// Mirrors content/insolation.ts.
const share = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297];
const yields = [1160, 1050, 1270, 1230, 1085, 1125, 1340, 1090, 1120, 1120, 1240, 1200, 1080, 1330, 1320, 1190, 1060, 1100, 1100, 1210, 1360, 1115, 1200, 1110, 1070, 1330];

test("5 kW: 9 panels of 550–570 W, 4.95–5.13 kW, ≈ 23 m² (the owner's brief)", () => {
  assert.equal(panelsForKw(5), 9);
  assert.deepEqual(panelsKwRange(9), { min: 4.95, max: 5.13 });
  assert.equal(panelAreaM2(9), 23);
});

test("panels for the menu mockup: 10 → 18, 30 → 53, 100 → 176", () => {
  assert.equal(panelsForKw(10), 18);
  assert.equal(panelsForKw(30), 53);
  assert.equal(panelsForKw(100), 176);
});

test("5 kW at the national average: ≈ 5 900 a year, ≈ 490 a month, June ≈ 850, December ≈ 170", () => {
  const national = average(yields);
  const year = stationYear(national, 5);
  assert.equal(roundYear(year), 5900);
  assert.equal(roundMonth(year / 12), 490);
  const months = stationMonths(national, share, 5);
  assert.equal(roundMonth(months[5]), 850);
  assert.equal(roundMonth(months[11]), 170);
  assert.deepEqual(fittingConsumption(year), { low: 450, high: 500 });
});

test("savings «up to» = year × tariff, down to 100: ≈ 25 400 ₴ at 4.32", () => {
  const year = stationYear(average(yields), 5);
  assert.equal(maxSavings(year, 4.32), 25400);
});

test("fixed plant, Lviv 450 kWh a month: self-use caps each month, surplus in summer, payback only with a cost", () => {
  const months = stationMonths(1080, share, 5);
  const estimate = fixedPlantEstimate({ months, monthlyKwh: 450, tariff: 4.32 });
  assert.equal(Math.round(estimate.year), 5400);
  assert.equal(Math.round(estimate.coverage), 100);
  // Self-use + surplus = generation; self-use + from grid = consumption.
  assert.ok(Math.abs(estimate.selfUse + estimate.surplus - estimate.year) < 1e-6);
  assert.ok(Math.abs(estimate.selfUse + estimate.fromGrid - 450 * 12) < 1e-6);
  assert.equal(Math.round(estimate.savings / 1000), 18);
  assert.equal(roundYear(estimate.surplus), 1200);
  assert.equal(estimate.paybackYears, null);
  const paid = fixedPlantEstimate({ months, monthlyKwh: 450, tariff: 4.32, cost: 180000 });
  assert.equal(Math.round(paid.paybackYears * 10) / 10, Math.round((180000 / paid.savings) * 10) / 10);
});

test("no consumption: nothing saved, everything is surplus", () => {
  const estimate = fixedPlantEstimate({ months: stationMonths(1080, share, 5), monthlyKwh: 0, tariff: 4.32, cost: 100000 });
  assert.equal(estimate.savings, 0);
  assert.equal(estimate.coverage, 0);
  assert.equal(estimate.paybackYears, null);
});
