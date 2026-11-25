/**
 * A day with outages on the backup region pages: the battery's state of charge
 * hour by hour. Discharge is real (load ÷ nominal capacity); recharge after the
 * grid returns is illustrative (content/ has no charge rate). Pure, tested in
 * backup-day.test.mjs.
 */

export type ChargePoint = { hour: number; percent: number };

/** State of charge after `hours` on battery from full, % of the nominal capacity (never below 0). */
export function chargeAfter(hours: number, loadW: number, capacityWh: number): number {
  return Math.max(0, 100 - (hours * loadW * 100) / capacityWh);
}

/**
 * Break points of the charge line over 24 h: full → outage (linear discharge) →
 * grid back (linear recharge over `rechargeHours`, illustrative) → full.
 */
export function dayChargeCurve(options: {
  starts: readonly number[];
  hours: number;
  loadW: number;
  capacityWh: number;
  rechargeHours: number;
}): ChargePoint[] {
  const { starts, hours, loadW, capacityWh, rechargeHours } = options;
  const points: ChargePoint[] = [{ hour: 0, percent: 100 }];
  let percent = 100;
  for (const start of [...starts].sort((a, b) => a - b)) {
    points.push({ hour: start, percent });
    const end = Math.min(24, start + hours);
    percent = Math.max(0, percent - ((end - start) * loadW * 100) / capacityWh);
    points.push({ hour: end, percent });
    const full = end + (rechargeHours * (100 - percent)) / 100;
    if (full <= 24) {
      percent = 100;
      points.push({ hour: full, percent });
    } else {
      percent += ((24 - end) * 100) / rechargeHours;
      points.push({ hour: 24, percent: Math.min(100, percent) });
      return points;
    }
  }
  if (points[points.length - 1].hour < 24) points.push({ hour: 24, percent });
  return points;
}
