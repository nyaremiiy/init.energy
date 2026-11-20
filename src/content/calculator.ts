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

export type Region = {
  slug: string;
  name: { uk: string; en: string };
  /** kWh per 1 kW of panels per year. */
  specificYield: number;
};

/**
 * Oblasts of Ukraine. Never list Russia or Belarus; other countries only if
 * they appear in a confirmed service area (none yet).
 *
 * TODO(content): specificYield values are rough PVGIS-style estimates
 * (south ≈ 1 250–1 300, west/north ≈ 1 080–1 100 kWh/kWp). Verify every
 * value with PVGIS or INIT ENERGY engineers before launch. Crimea and
 * Sevastopol are left out until the owner decides the service area.
 */
export const regions: Region[] = [
  {
    slug: "vinnytska",
    name: { uk: "Вінницька область", en: "Vinnytsia Oblast" },
    specificYield: 1150,
  },
  {
    slug: "volynska",
    name: { uk: "Волинська область", en: "Volyn Oblast" },
    specificYield: 1080,
  },
  {
    slug: "dnipropetrovska",
    name: { uk: "Дніпропетровська область", en: "Dnipropetrovsk Oblast" },
    specificYield: 1220,
  },
  {
    slug: "donetska",
    name: { uk: "Донецька область", en: "Donetsk Oblast" },
    specificYield: 1230,
  },
  {
    slug: "zhytomyrska",
    name: { uk: "Житомирська область", en: "Zhytomyr Oblast" },
    specificYield: 1100,
  },
  {
    slug: "zakarpatska",
    name: { uk: "Закарпатська область", en: "Zakarpattia Oblast" },
    specificYield: 1130,
  },
  {
    slug: "zaporizka",
    name: { uk: "Запорізька область", en: "Zaporizhzhia Oblast" },
    specificYield: 1260,
  },
  {
    slug: "ivano-frankivska",
    name: { uk: "Івано-Франківська область", en: "Ivano-Frankivsk Oblast" },
    specificYield: 1100,
  },
  {
    slug: "kyivska",
    name: { uk: "Київська область", en: "Kyiv Oblast" },
    specificYield: 1130,
  },
  { slug: "kyiv", name: { uk: "м. Київ", en: "Kyiv" }, specificYield: 1130 },
  {
    slug: "kirovohradska",
    name: { uk: "Кіровоградська область", en: "Kirovohrad Oblast" },
    specificYield: 1190,
  },
  {
    slug: "luhanska",
    name: { uk: "Луганська область", en: "Luhansk Oblast" },
    specificYield: 1200,
  },
  {
    slug: "lvivska",
    name: { uk: "Львівська область", en: "Lviv Oblast" },
    specificYield: 1090,
  },
  {
    slug: "mykolaivska",
    name: { uk: "Миколаївська область", en: "Mykolaiv Oblast" },
    specificYield: 1270,
  },
  {
    slug: "odeska",
    name: { uk: "Одеська область", en: "Odesa Oblast" },
    specificYield: 1290,
  },
  {
    slug: "poltavska",
    name: { uk: "Полтавська область", en: "Poltava Oblast" },
    specificYield: 1170,
  },
  {
    slug: "rivnenska",
    name: { uk: "Рівненська область", en: "Rivne Oblast" },
    specificYield: 1090,
  },
  {
    slug: "sumska",
    name: { uk: "Сумська область", en: "Sumy Oblast" },
    specificYield: 1110,
  },
  {
    slug: "ternopilska",
    name: { uk: "Тернопільська область", en: "Ternopil Oblast" },
    specificYield: 1100,
  },
  {
    slug: "kharkivska",
    name: { uk: "Харківська область", en: "Kharkiv Oblast" },
    specificYield: 1170,
  },
  {
    slug: "khersonska",
    name: { uk: "Херсонська область", en: "Kherson Oblast" },
    specificYield: 1300,
  },
  {
    slug: "khmelnytska",
    name: { uk: "Хмельницька область", en: "Khmelnytskyi Oblast" },
    specificYield: 1120,
  },
  {
    slug: "cherkaska",
    name: { uk: "Черкаська область", en: "Cherkasy Oblast" },
    specificYield: 1160,
  },
  {
    slug: "chernivetska",
    name: { uk: "Чернівецька область", en: "Chernivtsi Oblast" },
    specificYield: 1130,
  },
  {
    slug: "chernihivska",
    name: { uk: "Чернігівська область", en: "Chernihiv Oblast" },
    specificYield: 1100,
  },
];

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
