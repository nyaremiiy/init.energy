/**
 * Quick calculator formulas: pure functions, no imports, so they run in the
 * browser, on the server and in `node --test` without a build step.
 * Data (regions, plans, ranges, battery candidates) lives in content/calculator.ts.
 */

export type BatteryCandidate = {
  id: string;
  /** Capacity of one unit, kWh. */
  capacityKwh: number;
  /** Usable depth of discharge, 0–1. */
  usableDepth: number;
  /** How many units can be combined (1 = not modular). */
  maxModules: number;
};

export type CalculatorInput = {
  monthlyKwh: number;
  /** kWh produced per 1 kW of panels per year in the chosen region. */
  specificYield: number;
  /** Standard solar plant sizes, kW, ascending. */
  solarPlans: number[];
  backupHours: number;
  /** Share of the average load the battery has to carry, 0–1. */
  criticalLoadShare: number;
  /** Battery candidates in the order they are tried. */
  candidates: BatteryCandidate[];
  needSolar: boolean;
  needBattery: boolean;
};

export type BatteryPick = {
  id: string;
  modules: number;
  capacityKwh: number;
  usableDepth: number;
  /** false when even the largest option is smaller than the need. */
  fits: boolean;
};

export type Recommendation = {
  solarKw?: number;
  /** false when the need is above the largest standard plan. */
  solarFits?: boolean;
  annualGenerationKwh?: number;
  requiredCapacityKwh?: number;
  battery?: BatteryPick;
  backupHours?: number;
};

const HOURS_PER_MONTH = 30 * 24;

export function annualConsumption(monthlyKwh: number): number {
  return monthlyKwh * 12;
}

/** Average load, kW. */
export function averageLoadKw(monthlyKwh: number): number {
  return monthlyKwh / HOURS_PER_MONTH;
}

/** Rounds the needed power UP to the nearest standard plan. */
export function pickSolarPlan(
  monthlyKwh: number,
  specificYield: number,
  solarPlans: number[],
): { kw: number; fits: boolean } {
  const needed = annualConsumption(monthlyKwh) / specificYield;
  const plan = solarPlans.find((kw) => kw >= needed);

  return plan === undefined
    ? { kw: solarPlans[solarPlans.length - 1], fits: false }
    : { kw: plan, fits: true };
}

export function annualGeneration(solarKw: number, specificYield: number) {
  return solarKw * specificYield;
}

/** kWh of nominal capacity needed to carry the critical load for `hours`. */
export function requiredCapacity(
  monthlyKwh: number,
  hours: number,
  criticalLoadShare: number,
  usableDepth: number,
): number {
  return (averageLoadKw(monthlyKwh) * hours * criticalLoadShare) / usableDepth;
}

/**
 * First candidate (in order) whose capacity × the fewest modules covers the
 * need for its own usable depth. If none fits, the last candidate at its
 * maximum size, marked `fits: false`.
 */
export function pickBattery(
  monthlyKwh: number,
  hours: number,
  criticalLoadShare: number,
  candidates: BatteryCandidate[],
): BatteryPick | undefined {
  for (const candidate of candidates) {
    const need = requiredCapacity(
      monthlyKwh,
      hours,
      criticalLoadShare,
      candidate.usableDepth,
    );
    const modules = Math.max(1, Math.ceil(need / candidate.capacityKwh - 1e-9));

    if (modules <= candidate.maxModules) {
      return {
        id: candidate.id,
        modules,
        capacityKwh: modules * candidate.capacityKwh,
        usableDepth: candidate.usableDepth,
        fits: true,
      };
    }
  }

  const last = candidates[candidates.length - 1];
  if (!last) return undefined;

  return {
    id: last.id,
    modules: last.maxModules,
    capacityKwh: last.maxModules * last.capacityKwh,
    usableDepth: last.usableDepth,
    fits: false,
  };
}

/** Hours the battery carries the critical load. */
export function backupHours(
  capacityKwh: number,
  usableDepth: number,
  monthlyKwh: number,
  criticalLoadShare: number,
): number {
  return (
    (capacityKwh * usableDepth) /
    (averageLoadKw(monthlyKwh) * criticalLoadShare)
  );
}

export function calculate(input: CalculatorInput): Recommendation {
  const result: Recommendation = {};

  if (input.needSolar) {
    const plan = pickSolarPlan(
      input.monthlyKwh,
      input.specificYield,
      input.solarPlans,
    );
    result.solarKw = plan.kw;
    result.solarFits = plan.fits;
    result.annualGenerationKwh = annualGeneration(plan.kw, input.specificYield);
  }

  if (input.needBattery) {
    const battery = pickBattery(
      input.monthlyKwh,
      input.backupHours,
      input.criticalLoadShare,
      input.candidates,
    );

    if (battery) {
      result.battery = battery;
      result.requiredCapacityKwh = requiredCapacity(
        input.monthlyKwh,
        input.backupHours,
        input.criticalLoadShare,
        battery.usableDepth,
      );
      result.backupHours = backupHours(
        battery.capacityKwh,
        battery.usableDepth,
        input.monthlyKwh,
        input.criticalLoadShare,
      );
    }
  }

  return result;
}

/** Generation is shown rounded to hundreds with «≈». */
export function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}
