import type { BatteryCandidate } from "@/lib/calculator";

import { routes } from "./routes";
import { storageCandidates, usableShare } from "./storage";

export type CalculatorSegment = "apartment" | "house" | "business";
export type CalculatorGoal = "reserve" | "economy" | "both";

export const calculatorSegments: CalculatorSegment[] = [
  "apartment",
  "house",
  "business",
];
export const calculatorGoals: CalculatorGoal[] = ["reserve", "economy", "both"];

/** Goals offered per segment; the rest render disabled. */
export const allowedGoals: Record<CalculatorSegment, CalculatorGoal[]> = {
  apartment: ["reserve"],
  house: ["reserve", "economy", "both"],
  business: ["reserve", "economy", "both"],
};

// Regions and their yield: content/insolation.ts (one list for every calculator and region page).

/** TODO(content): confirm the standard plant sizes INIT ENERGY offers (no powerPlans.ts yet). */
export const solarPlans: number[] = [
  3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 250, 300, 400,
  500,
];

export type ConsumptionRange = {
  min: number;
  max: number;
  step: number;
  default: number;
};

/** kWh per month. TODO(content): confirm typical ranges per segment. */
export const consumptionRange: Record<CalculatorSegment, ConsumptionRange> = {
  apartment: { min: 50, max: 600, step: 10, default: 200 },
  house: { min: 100, max: 1200, step: 10, default: 450 },
  business: { min: 500, max: 50000, step: 500, default: 5000 },
};

/**
 * Share of the average load the battery carries during an outage.
 * TODO(content): confirm with engineers (lighting/router vs. boiler/pump vs. production).
 */
export const criticalLoadShare: Record<CalculatorSegment, number> = {
  apartment: 0.3,
  house: 0.5,
  business: 0.6,
};

export const backupHoursRange = { min: 2, max: 24, step: 1, default: 8 };

/** Battery candidates for a segment: order, capacities and module limits from content/storage.ts. */
export function batteryCandidates(
  segment: CalculatorSegment,
): BatteryCandidate[] {
  return storageCandidates(segment).map(({ id, capacityKwh, maxModules }) => ({
    id,
    capacityKwh,
    usableDepth: usableShare,
    maxModules,
  }));
}

export type SolutionLink = {
  href: string;
  serviceKey: "turnkeySes" | "backupHub";
};

/**
 * Solution page for the result card. Backup only (always for apartments) →
 * the backup power hub (segment pages are still planned); goals with solar →
 * turnkey solar plants. Localised with `localizePath` in the view.
 */
export function solutionLink(goal: CalculatorGoal): SolutionLink {
  return goal === "reserve"
    ? { href: routes.backup.hub, serviceKey: "backupHub" }
    : { href: routes.services.turnkeySes, serviceKey: "turnkeySes" };
}

export const calculatorDefaults = {
  segment: "house" as CalculatorSegment,
  goal: "both" as CalculatorGoal,
  region: "lvivska",
  hours: backupHoursRange.default,
};
