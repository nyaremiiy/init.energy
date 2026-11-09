// Run: npm test (node --test; Node strips the TypeScript types itself).
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  annualGeneration,
  backupHours,
  calculate,
  pickBattery,
  pickSolarPlan,
  requiredCapacity,
  roundToHundreds,
} from "./calculator.ts";

const plans = [3, 5, 8, 10, 15, 20, 30, 50];
const house = [
  { id: "svitHome", capacityKwh: 5.12, usableDepth: 0.9, maxModules: 1 },
  { id: "svitPlus5000", capacityKwh: 5.12, usableDepth: 0.9, maxModules: 3 },
  { id: "svitPlus16000", capacityKwh: 16.07, usableDepth: 0.9, maxModules: 2 },
];

test("solar plan rounds up to the next standard size", () => {
  // 450 × 12 = 5400 kWh/yr ÷ 1100 = 4.91 kW → 5 kW
  assert.deepEqual(pickSolarPlan(450, 1100, plans), { kw: 5, fits: true });
  // 451 × 12 = 5412 ÷ 1000 = 5.41 kW → 8 kW
  assert.deepEqual(pickSolarPlan(451, 1000, plans), { kw: 8, fits: true });
});

test("solar plan above the largest size is flagged", () => {
  assert.deepEqual(pickSolarPlan(10000, 1000, plans), { kw: 50, fits: false });
});

test("generation and rounding", () => {
  assert.equal(annualGeneration(5, 1090), 5450);
  assert.equal(roundToHundreds(5450), 5500);
  assert.equal(roundToHundreds(5449), 5400);
});

test("required capacity formula", () => {
  // 720 kWh/month → 1 kW average × 10 h × 0.5 ÷ 0.9 = 5.56 kWh
  assert.ok(Math.abs(requiredCapacity(720, 10, 0.5, 0.9) - 5.5556) < 0.001);
});

test("battery: first candidate that fits wins", () => {
  // 450 kWh → 0.625 kW × 8 h × 0.5 ÷ 0.9 = 2.78 kWh → SVIT HOME
  const pick = pickBattery(450, 8, 0.5, house);
  assert.equal(pick.id, "svitHome");
  assert.equal(pick.modules, 1);
  assert.equal(pick.fits, true);
});

test("battery: modular product takes the fewest modules", () => {
  // 720 kWh → 1 kW × 16 h × 0.5 ÷ 0.9 = 8.89 kWh → 2 × SVIT PLUS 5000
  const pick = pickBattery(720, 16, 0.5, house);
  assert.equal(pick.id, "svitPlus5000");
  assert.equal(pick.modules, 2);
  assert.ok(Math.abs(pick.capacityKwh - 10.24) < 1e-9);
});

test("battery: nothing fits → largest option, flagged", () => {
  // 5000 kWh → 6.94 kW × 24 h × 0.5 ÷ 0.9 = 92.6 kWh > 2 × 16.07
  const pick = pickBattery(5000, 24, 0.5, house);
  assert.equal(pick.id, "svitPlus16000");
  assert.equal(pick.modules, 2);
  assert.equal(pick.fits, false);
});

test("backup hours from capacity", () => {
  // 5.12 × 0.9 ÷ (0.625 × 0.5) = 14.75 h
  assert.ok(Math.abs(backupHours(5.12, 0.9, 450, 0.5) - 14.7456) < 0.001);
});

test("calculate: goals switch parts on and off", () => {
  const base = {
    monthlyKwh: 450,
    specificYield: 1090,
    solarPlans: plans,
    backupHours: 8,
    criticalLoadShare: 0.5,
    candidates: house,
  };
  const both = calculate({ ...base, needSolar: true, needBattery: true });
  assert.equal(both.solarKw, 5);
  assert.equal(both.battery.id, "svitHome");

  const reserve = calculate({ ...base, needSolar: false, needBattery: true });
  assert.equal(reserve.solarKw, undefined);
  assert.ok(reserve.battery);

  const economy = calculate({ ...base, needSolar: true, needBattery: false });
  assert.equal(economy.battery, undefined);
  assert.equal(economy.solarKw, 5);
});

test("apartment: bigger need moves from SVIT 600 to grid-charged batteries", () => {
  const apartment = [
    { id: "svit600", capacityKwh: 0.865, usableDepth: 0.9, maxModules: 1 },
    { id: "svitHome", capacityKwh: 5.12, usableDepth: 0.9, maxModules: 1 },
    { id: "svitPlus5000", capacityKwh: 5.12, usableDepth: 0.9, maxModules: 3 },
  ];
  // 200 kWh → 0.278 kW × 8 h × 0.3 ÷ 0.9 = 0.74 kWh → SVIT 600
  assert.equal(pickBattery(200, 8, 0.3, apartment).id, "svit600");
  // 400 kWh × 12 h → 0.556 × 12 × 0.3 ÷ 0.9 = 2.22 kWh → SVIT HOME
  assert.equal(pickBattery(400, 12, 0.3, apartment).id, "svitHome");
  // 600 kWh × 24 h → 0.833 × 24 × 0.3 ÷ 0.9 = 6.67 kWh → 2 × SVIT PLUS 5000
  const big = pickBattery(600, 24, 0.3, apartment);
  assert.equal(big.id, "svitPlus5000");
  assert.equal(big.modules, 2);
});
