import test from "node:test";
import assert from "node:assert/strict";
import { calculateSesCore } from "./ses-core.ts";

const profile = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297];
const dataset = {
  regions: [{ id: "lvivska", yield: 1080 }], monthlyShare: profile,
  orientationFactor: { "roof-south": 1, "roof-east-west": 0.85, ground: 1 },
  kwStep: 0.5, minKw: 1, kwpPerM2: 0.18, usableCapacityFactor: 1,
  appliances: [
    { id: "boiler", powerW: 60 }, { id: "fridge", powerW: 150 }, { id: "lights", powerW: 100 },
    { id: "router", powerW: 8 }, { id: "pump", powerW: 750 }, { id: "stove", powerW: 1000 }, { id: "ac", powerW: 750 },
  ],
  products: {
    svit600: { name: "SVIT 600", href: "/svit-600/" },
    svitHome: { name: "SVIT HOME", href: "/svit-home/" },
    svitPlus5000: { name: "SVIT PLUS 5000", href: "/svit-plus-5000/" },
    svitPlus16000: { name: "SVIT PLUS 16000", href: "/svit-plus-16000/" },
    lithiumvalley: { name: "LITHIUMVALLEY", href: "/bess/" },
  },
  candidates: [
    { id: "svit600", capacityKwh: 0.865, inverterKw: 0.6, maxModules: 1, segments: ["apartment"] },
    { id: "svitHome", capacityKwh: 5.12, inverterKw: 6, maxModules: 1, segments: ["apartment", "house"] },
    { id: "svitPlus5000", capacityKwh: 5.12, stackable: true, maxModules: 6, segments: ["house", "business"] },
    { id: "svitPlus16000", capacityKwh: 16.07, maxModules: 1, segments: ["house", "business"] },
    { id: "lithiumvalley", capacityKwh: 208, inverterKw: 50, maxModules: 4, segments: ["business"] },
  ],
};

const base = { objectType: "house", goal: "both", monthlyKwh: 450, tariff: 4.32, regionId: "lvivska", placement: "roof-south", backupLoads: ["boiler", "fridge", "lights", "router"], backupHours: 8 };

test("matches the documented house example", () => {
  const result = calculateSesCore(base, dataset);
  assert.equal(result.kw, 5);
  assert.ok(Math.abs(result.generationYear - 5400) < 1);
  assert.ok(Math.abs(result.savingsYear - 18000) < 150);
  assert.equal(result.battery?.id, "svitHome");
  assert.ok(Math.abs(result.battery.backupHours - 16) < 0.5);
  assert.ok(Math.abs(result.surplus.kwh - 329) < 3);
  assert.ok(Math.abs(result.deficit.kwh - 289) < 3);
});

test("converts a monthly bill to consumption", () => {
  assert.ok(Math.abs(calculateSesCore({ ...base, monthlyKwh: undefined, monthlyBill: 1944 }, dataset).monthlyKwh - 450) < 1e-9);
});

test("caps capacity to the roof", () => {
  const result = calculateSesCore({ ...base, roofAreaM2: 10 }, dataset);
  assert.equal(result.kw, 1.5);
  assert.equal(result.limitedByRoof, true);
});

test("only calculates payback when a budget is supplied", () => {
  assert.equal(calculateSesCore(base, dataset).paybackYears, null);
  assert.ok(calculateSesCore({ ...base, budget: 180000 }, dataset).paybackYears);
});

test("savings-only does not recommend a battery", () => {
  assert.equal(calculateSesCore({ ...base, goal: "savings" }, dataset).battery, null);
});

test("heavy apartment load has no compatible single-system recommendation", () => {
  const result = calculateSesCore({ ...base, objectType: "apartment", backupLoads: ["stove", "ac", "pump"], backupHours: 24 }, dataset);
  assert.equal(result.battery, null);
});
