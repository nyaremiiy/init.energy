import assert from "node:assert/strict";
import { test } from "node:test";

import { pickSolarPlan } from "../calculator.ts";
import {
  average,
  deviationPercent,
  mapBucket,
  peakMonths,
  roundMonth,
  roundYear,
  spreadPercent,
  stationMonths,
  stationYear,
} from "./region-yield.ts";

// Mirrors content/insolation.ts.
const share = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297];
const yields = [1160, 1050, 1270, 1230, 1085, 1125, 1340, 1090, 1120, 1120, 1240, 1200, 1080, 1330, 1320, 1190, 1060, 1100, 1100, 1210, 1360, 1115, 1200, 1110, 1070, 1330];
const plans = [3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100];

test("Lviv: 5 kW plant per year, month and deviation (the owner's mockup)", () => {
  const year = stationYear(1080);
  assert.equal(year, 5400);
  assert.equal(roundYear(year), 5400);
  assert.equal(roundMonth(year / 12), 450);
  const avg = average(yields);
  assert.equal(Math.round(avg), 1177);
  assert.equal(roundYear(stationYear(avg)), 5900);
  assert.equal(deviationPercent(1080, avg), -8);
});

test("monthly values: exact for the chart, rounded to 10 in text", () => {
  const months = stationMonths(1080, share);
  assert.equal(Math.round(months[5]), 779);
  assert.equal(Math.round(months[6]), 774);
  assert.equal(roundMonth(months[5]), 780);
  assert.equal(roundMonth(months[11]), 160);
  assert.ok(Math.abs(months.reduce((sum, value) => sum + value, 0) - 5400) < 1);
  assert.deepEqual(peakMonths(months), [5, 6]);
});

test("south has more sun: positive deviation", () => {
  assert.equal(deviationPercent(1360, average(yields)), 16);
});

test("plant power for a house uses the calculator's pickSolarPlan", () => {
  assert.equal(pickSolarPlan(450, 1080, plans).kw, 5);
  assert.equal(pickSolarPlan(900, 1080, plans).kw, 10);
  // Less sun → the next standard size.
  assert.equal(pickSolarPlan(450, 1050, plans).kw, 8);
});

test("spread between the sunniest and the least sunny region", () => {
  assert.equal(spreadPercent(Math.max(...yields), Math.min(...yields)), 30);
});

test("map buckets by a 5 kW plant's year", () => {
  assert.equal(mapBucket(5250), 0);
  assert.equal(mapBucket(5500), 1);
  assert.equal(mapBucket(5800), 2);
  assert.equal(mapBucket(6000), 3);
  assert.equal(mapBucket(6800), 4);
});
