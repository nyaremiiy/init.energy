/**
 * Numbers of the «solar plant by power» pages (/cec/5-kvt/ …): panels, area,
 * savings and the fixed-power calculator. Pure, no imports — tested in
 * ses-power.test.mjs. Generation itself comes from region-yield.ts
 * (`stationYear`, `stationMonths`) and savings use the same rule as the
 * payback calculator (ses-core.ts, step 5): energy used on site × tariff.
 */

/** Panels engineers install now (owner, 2026-11-27), W. */
export const PANEL_W = { min: 550, max: 570 } as const;

/** Footprint of one 550–570 W panel, m² (≈ 2.28 × 1.13 m) — an estimate, more with spacing. */
export const PANEL_AREA_M2 = 2.6;

/** Panels for a plant: power ÷ the largest panel, rounded up (5 kW → 9). */
export function panelsForKw(kw: number): number {
  return Math.ceil((kw * 1000) / PANEL_W.max);
}

/** Power range of those panels, kW (9 → 4.95–5.13). */
export function panelsKwRange(panels: number): { min: number; max: number } {
  return { min: (panels * PANEL_W.min) / 1000, max: (panels * PANEL_W.max) / 1000 };
}

/** Panel area, whole m² (9 → 23). */
export function panelAreaM2(panels: number): number {
  return Math.round(panels * PANEL_AREA_M2);
}

/** «Up to» savings when all the energy is used on site: year × tariff, down to 100. */
export function maxSavings(yearKwh: number, tariff: number): number {
  return Math.floor((yearKwh * tariff) / 100) * 100;
}

/** Monthly consumption the plant covers over a year: [low, high] in steps of 50 (5 900 kWh → 450–500). */
export function fittingConsumption(yearKwh: number, step = 50): { low: number; high: number } {
  const low = Math.floor(yearKwh / 12 / step) * step;
  return { low, high: low + step };
}

export type FixedPlantEstimate = {
  months: number[];
  year: number;
  /** Generation as a share of the yearly consumption, %. */
  coverage: number;
  /** Energy used on site (each month capped by consumption), kWh a year. */
  selfUse: number;
  savings: number;
  /** Generation above consumption (summer), kWh a year — can be sold. */
  surplus: number;
  /** Consumption the plant does not cover (winter), kWh a year — from the grid. */
  fromGrid: number;
  paybackYears: number | null;
};

/** The calculator on a power page: the plant size is fixed by the page. */
export function fixedPlantEstimate(input: {
  months: number[];
  monthlyKwh: number;
  tariff: number;
  cost?: number;
}): FixedPlantEstimate {
  const monthly = Math.max(0, input.monthlyKwh);
  const tariff = Math.max(0, input.tariff);
  const year = input.months.reduce((sum, value) => sum + value, 0);
  const selfUse = input.months.reduce((sum, value) => sum + Math.min(value, monthly), 0);
  const surplus = input.months.reduce((sum, value) => sum + Math.max(0, value - monthly), 0);
  const fromGrid = input.months.reduce((sum, value) => sum + Math.max(0, monthly - value), 0);
  const savings = selfUse * tariff;
  const paybackYears = input.cost && input.cost > 0 && savings > 0 ? input.cost / savings : null;
  return {
    months: input.months,
    year,
    coverage: monthly > 0 ? (year / (monthly * 12)) * 100 : 0,
    selfUse,
    savings,
    surplus,
    fromGrid,
    paybackYears,
  };
}
