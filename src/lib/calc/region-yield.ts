/**
 * Region page numbers: everything comes from the region's yield (kWh a year
 * from 1 kWp) and the monthly profile. Pure, no imports — tested in
 * region-yield.test.mjs. The unit people see is a 5 kW plant (≈ 9 panels of
 * 550–570 W, ses-power.ts), not «kWh from 1 kW».
 */

import { panelsForKw } from "./ses-power.ts";

/** The example plant on region pages, kW. */
export const STATION_KW = 5;
/** Panels in the example plant: the same formula as the power pages (5 kW → 9). */
export const STATION_PANELS = panelsForKw(STATION_KW);

export function stationYear(yieldPerKw: number, kw = STATION_KW): number {
  return yieldPerKw * kw;
}

/** Exact monthly generation of the plant, kWh (chart values). */
export function stationMonths(yieldPerKw: number, monthlyShare: readonly number[], kw = STATION_KW): number[] {
  return monthlyShare.map((share) => stationYear(yieldPerKw, kw) * share);
}

export function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Signed deviation from the national average, whole percent (−8 = 8 % less sun). */
export function deviationPercent(value: number, nationalAverage: number): number {
  return Math.round(((value - nationalAverage) / nationalAverage) * 100);
}

/** Year figures in text: to the nearest 100. */
export function roundYear(kwh: number): number {
  return Math.round(kwh / 100) * 100;
}

/** Month figures in text: to the nearest 10. */
export function roundMonth(kwh: number): number {
  return Math.round(kwh / 10) * 10;
}

/** Indexes of the `count` largest months (chart highlight), in calendar order. */
export function peakMonths(months: number[], count = 2): number[] {
  return months
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .slice(0, count)
    .map((item) => item.index)
    .sort((a, b) => a - b);
}

/** How much more the sunniest region yields than the least sunny one, whole percent. */
export function spreadPercent(max: number, min: number): number {
  return Math.round((max / min - 1) * 100);
}

/** Map legend bucket 0–4 for a 5 kW plant's year: < 5 500 / 5 500–5 750 / 5 750–6 000 / 6 000–6 500 / ≥ 6 500. */
export const mapThresholds = [5500, 5750, 6000, 6500] as const;

export function mapBucket(yearKwh: number): number {
  return mapThresholds.filter((threshold) => yearKwh >= threshold).length;
}
