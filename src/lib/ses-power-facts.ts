import { backupLoadSets, loadSetById, loadSetPowerW } from "@/content/backup";
import { insolationRegions, monthlyShare, type InsolationRegion } from "@/content/insolation";
import { referenceBatteries, type SesPowerPage } from "@/content/ses-power";
import { capacityKwh, capacityWh, usableShare } from "@/content/storage";
import { householdTariff } from "@/content/tariffs";
import { deviationPercent, peakMonths, roundMonth, roundYear, spreadPercent, stationMonths, stationYear } from "@/lib/calc/region-yield";
import { roundHours, runtimeHours } from "@/lib/calc/backup-runtime";
import { fittingConsumption, maxSavings, panelAreaM2, panelsForKw, panelsKwRange, PANEL_AREA_M2, PANEL_W } from "@/lib/calc/ses-power";
import { nationalYield } from "@/lib/region-stats";

export type PowerRegionRow = {
  region: InsolationRegion;
  /** kWh a year, rounded to 100. */
  year: number;
  /** Exact, for the bar width. */
  exactYear: number;
  deviation: number;
};

export type PowerBattery = {
  /** Nominal capacity, kWh (5.12, 16.07) — the hours are worked out from it. */
  capacityKwh: number;
  /** Shown in text: «≈ 5 / 16 кВт·год». */
  roundedKwh: number;
  capacityWh: number;
};

/**
 * Every figure of a power page, computed from the data: content/insolation.ts
 * (yield, monthly profile), tariffs.ts, backup.ts and storage.ts. The menu,
 * the meta description, the FAQ and the sections read this one object.
 */
export type PowerFacts = {
  kw: number;
  panels: number;
  panelW: typeof PANEL_W;
  kwRange: { min: number; max: number };
  area: number;
  panelArea: number;
  /** National average plant, kWh a year (rounded to 100) and a month (to 10). */
  year: number;
  month: number;
  /** Exact monthly values for the chart (national average). */
  months: number[];
  peaks: number[];
  best: number;
  /** Month with the least output: index and value rounded to 10. */
  lowest: { index: number; kwh: number };
  december: number;
  savings: number;
  tariff: typeof householdTariff;
  fits: { low: number; high: number };
  /** 26 regions, sunniest first. */
  regions: PowerRegionRow[];
  sunniest: PowerRegionRow;
  leastSunny: PowerRegionRow;
  spread: number;
  batteries: { small: PowerBattery; big: PowerBattery };
  /** The «whole house» load set (boiler, fridge, lights, router, pump), W. */
  houseLoad: number;
  houseHours: { small: number; big: number };
};

function battery(id: (typeof referenceBatteries)[number]): PowerBattery {
  return { capacityKwh: capacityKwh(id), roundedKwh: Math.round(capacityKwh(id)), capacityWh: capacityWh(id) };
}

/** Hours a battery runs a load (W), rounded like the backup hub table. */
export function batteryHours(item: PowerBattery, loadW: number): number {
  return roundHours(runtimeHours(item.capacityWh, loadW, usableShare));
}

export function powerFacts(page: Pick<SesPowerPage, "kw">): PowerFacts {
  const { kw } = page;
  const panels = panelsForKw(kw);
  const exactYear = stationYear(nationalYield, kw);
  const months = stationMonths(nationalYield, monthlyShare, kw);
  const peaks = peakMonths(months);
  const lowestIndex = months.indexOf(Math.min(...months));
  const regions = insolationRegions
    .map((region) => {
      const regionYear = stationYear(region.yield, kw);
      return { region, year: roundYear(regionYear), exactYear: regionYear, deviation: deviationPercent(region.yield, nationalYield) };
    })
    .toSorted((a, b) => b.exactYear - a.exactYear || a.region.shortName.uk.localeCompare(b.region.shortName.uk, "uk"));
  const small = battery(referenceBatteries[0]);
  const big = battery(referenceBatteries[1]);
  const houseLoad = loadSetPowerW(loadSetById("house"));

  return {
    kw,
    panels,
    panelW: PANEL_W,
    kwRange: panelsKwRange(panels),
    area: panelAreaM2(panels),
    panelArea: PANEL_AREA_M2,
    year: roundYear(exactYear),
    month: roundMonth(exactYear / 12),
    months,
    peaks,
    best: roundMonth(Math.max(...months)),
    lowest: { index: lowestIndex, kwh: roundMonth(months[lowestIndex]) },
    december: roundMonth(months[11]),
    savings: maxSavings(exactYear, householdTariff.value),
    tariff: householdTariff,
    fits: fittingConsumption(exactYear),
    regions,
    sunniest: regions[0],
    leastSunny: regions[regions.length - 1],
    spread: spreadPercent(regions[0].exactYear, regions[regions.length - 1].exactYear),
    batteries: { small, big },
    houseLoad,
    houseHours: { small: batteryHours(small, houseLoad), big: batteryHours(big, houseLoad) },
  };
}

/** Load sets of the outage section («Мінімум / + холодильник / Весь будинок»). */
export const powerLoadSets = backupLoadSets;
