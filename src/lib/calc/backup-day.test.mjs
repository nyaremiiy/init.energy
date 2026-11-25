import assert from "node:assert/strict";
import test from "node:test";

import { chargeAfter, dayChargeCurve } from "./backup-day.ts";

test("a 4-hour outage of the house set (1 068 W) drains SVIT HOME (5 120 Wh) to about 17 %", () => {
  assert.equal(Math.round(chargeAfter(4, 1068, 5120)), 17);
  assert.equal(chargeAfter(10, 1068, 5120), 0);
});

test("the day curve: full until the outage, the minimum at its end, full again before the next one", () => {
  const curve = dayChargeCurve({ starts: [18, 8], hours: 4, loadW: 1068, capacityWh: 5120, rechargeHours: 2.5 });
  assert.deepEqual(curve.slice(0, 2), [
    { hour: 0, percent: 100 },
    { hour: 8, percent: 100 },
  ]);
  assert.equal(curve[2].hour, 12);
  assert.equal(Math.round(curve[2].percent), 17);
  assert.equal(curve[3].percent, 100);
  assert.ok(curve[3].hour < 18);
  assert.equal(curve[curve.length - 1].hour, 24);
  assert.ok(curve.every((point) => point.percent >= 0 && point.percent <= 100));
});
