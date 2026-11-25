import test from "node:test";
import assert from "node:assert/strict";
import { calculateSesCore } from "./ses-core.ts";
import { roundHours, runtimeHours } from "./backup-runtime.ts";

const profile = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297];
const svit600 = { id: "svit600", capacityKwh: 0.865, maxModules: 1, outputW: 600, needsInverter: false };
const svitHome = { id: "svitHome", capacityKwh: 5.12, maxModules: 1, outputW: 6200, needsInverter: false };
const svitPlus5000 = { id: "svitPlus5000", capacityKwh: 5.12, maxModules: 16, needsInverter: true };
const svitPlus16000 = { id: "svitPlus16000", capacityKwh: 16.07, maxModules: 16, needsInverter: true };
const lithiumvalley = { id: "lithiumvalley", capacityKwh: 208, maxModules: 5, needsInverter: false };

const dataset = {
  regions: [{ id: "lvivska", yield: 1080 }], monthlyShare: profile,
  orientationFactor: { "roof-south": 1, "roof-east-west": 0.85, ground: 1 },
  kwStep: 0.5, minKw: 1, kwpPerM2: 0.18, usableShare: 0.9,
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
  // Mirrors content/storage.ts: order per segment, maxParallel and outputs from products.ts.
  candidates: {
    apartment: [svit600, svitHome, svitPlus5000],
    house: [svitHome, svitPlus5000, svitPlus16000],
    business: [svitPlus16000, svitPlus5000, lithiumvalley],
  },
};

const base = { objectType: "house", goal: "both", monthlyKwh: 450, tariff: 4.32, regionId: "lvivska", placement: "roof-south", backupLoads: ["boiler", "fridge", "lights", "router"], backupHours: 8 };

test("matches the documented house example", () => {
  const result = calculateSesCore(base, dataset);
  assert.equal(result.kw, 5);
  assert.ok(Math.abs(result.generationYear - 5400) < 1);
  assert.ok(Math.abs(result.savingsYear - 18000) < 150);
  assert.equal(result.battery?.id, "svitHome");
  // 5.12 kWh × 90 % ÷ 318 W = 14.5 h (was 16.1 h at 100 % of the nominal capacity).
  assert.equal(roundHours(result.battery.backupHours), 14.5);
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

test("heavy apartment load moves past SVIT 600 / SVIT HOME to SVIT PLUS 5000 × n", () => {
  // stove + AC + pump = 2.5 kW × 24 h = 60 kWh ÷ (5.12 × 0.9) → 14 modules, separate inverter.
  const result = calculateSesCore({ ...base, objectType: "apartment", backupLoads: ["stove", "ac", "pump"], backupHours: 24 }, dataset);
  assert.equal(result.battery?.id, "svitPlus5000");
  assert.equal(result.battery.modules, 14);
  assert.equal(result.battery.inverterNote, true);
});

test("a load above the product's output rules it out", () => {
  // 1 068 W house set for 2 h: SVIT 600 (600 W) cannot run it.
  const result = calculateSesCore({ ...base, objectType: "apartment", backupLoads: ["boiler", "fridge", "lights", "router", "pump"], backupHours: 2 }, dataset);
  assert.equal(result.battery?.id, "svitHome");
});

test("SVIT HOME gives the same hours as the autonomy table on /rezervne-zhyvlennya/", () => {
  // The hub's «house» set: boiler, fridge, lights, router, pump = 1 068 W.
  const loads = ["boiler", "fridge", "lights", "router", "pump"];
  const result = calculateSesCore({ ...base, backupLoads: loads, backupHours: 4 }, dataset);
  assert.equal(result.battery?.id, "svitHome");
  assert.equal(roundHours(result.battery.backupHours), roundHours(runtimeHours(5120, 1068, 0.9)));
  assert.equal(roundHours(result.battery.backupHours), 4.3);
});

test("SVIT PLUS 16000 is never offered above its parallel limit (16)", () => {
  for (const objectType of ["apartment", "house", "business"]) {
    for (let hours = 2; hours <= 24; hours += 1) {
      const result = calculateSesCore({ ...base, objectType, backupLoads: ["stove", "ac", "pump", "fridge"], backupHours: hours }, dataset);
      if (result.battery?.id === "svitPlus16000") assert.ok(result.battery.modules <= svitPlus16000.maxModules);
    }
  }
});
