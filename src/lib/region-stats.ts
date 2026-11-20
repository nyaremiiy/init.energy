import { solarPlans } from "@/content/calculator";
import { insolationRegions, monthlyShare, type InsolationRegion } from "@/content/insolation";
import { pickSolarPlan } from "@/lib/calculator";
import {
  average,
  deviationPercent,
  peakMonths,
  roundMonth,
  roundYear,
  spreadPercent,
  stationMonths,
  stationYear,
} from "@/lib/calc/region-yield";

/** National average yield, kWh a year from 1 kWp — over every region in content/insolation.ts. */
export const nationalYield = average(insolationRegions.map((region) => region.yield));

/** A 5 kW plant at the national average, kWh a year (rounded to 100). */
export const nationalStationYear = roundYear(stationYear(nationalYield));

function byYield(direction: 1 | -1): InsolationRegion {
  return insolationRegions.reduce((best, region) => (direction * (region.yield - best.yield) > 0 ? region : best));
}

/** Sunniest and least sunny regions (the map summary on /cec/). */
export const sunniestRegion = byYield(1);
export const leastSunnyRegion = byYield(-1);
/** How much more the south yields than the west, whole percent. */
export const regionSpreadPercent = spreadPercent(sunniestRegion.yield, leastSunnyRegion.yield);

/** Monthly consumption of the house examples on region pages, kWh. */
export const houseExamples = { small: 450, big: 900 } as const;

export type RegionStats = {
  /** 5 kW plant, kWh a year, rounded to 100. */
  year: number;
  /** Average month, rounded to 10. */
  monthAverage: number;
  /** Exact months for the chart. */
  months: number[];
  /** Two largest months (chart highlight). */
  peaks: number[];
  /** Largest month: index and value rounded to 10. */
  best: { index: number; kwh: number };
  /** December, rounded to 10. */
  december: number;
  /** Signed deviation from the national average, %. */
  deviation: number;
  /** Plant power for the house examples (the calculator's standard sizes). */
  kwSmall: number;
  kwBig: number;
};

export function regionStats(region: InsolationRegion): RegionStats {
  const months = stationMonths(region.yield, monthlyShare);
  const peaks = peakMonths(months);
  const bestIndex = months.indexOf(Math.max(...months));
  const year = stationYear(region.yield);

  return {
    year: roundYear(year),
    monthAverage: roundMonth(year / 12),
    months,
    peaks,
    best: { index: bestIndex, kwh: roundMonth(months[bestIndex]) },
    december: roundMonth(months[11]),
    deviation: deviationPercent(region.yield, nationalYield),
    kwSmall: pickSolarPlan(houseExamples.small, region.yield, solarPlans).kw,
    kwBig: pickSolarPlan(houseExamples.big, region.yield, solarPlans).kw,
  };
}
