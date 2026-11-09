import type { BatteryCandidate } from "@/lib/calculator";

import { products, type ProductId } from "./products";
import { routes } from "./routes";

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

/**
 * Usable depth of discharge per product.
 * TODO(content): products.ts has no DoD yet — 0.9 is a typical LiFePO₄ value, confirm per product.
 */
export const usableDepth: Record<ProductId, number> = {
  svit600: 0.9,
  svitHome: 0.9,
  svitPlus5000: 0.9,
  svitPlus16000: 0.9,
  lithiumvalley: 0.9,
};

type CandidateRule = { product: ProductId; maxModules: number };

/**
 * Battery candidates per segment, tried in order.
 * TODO(content): confirm max parallel modules for SVIT PLUS 5000/16000 and
 * the LITHIUMVALLEY step (208 kWh blocks up to 1 044 kWh assumed).
 */
const candidateRules: Record<CalculatorSegment, CandidateRule[]> = {
  apartment: [{ product: "svit600", maxModules: 1 }],
  house: [
    { product: "svitHome", maxModules: 1 },
    { product: "svitPlus5000", maxModules: 3 },
    { product: "svitPlus16000", maxModules: 2 },
  ],
  business: [
    { product: "svitPlus16000", maxModules: 4 },
    { product: "lithiumvalley", maxModules: 5 },
  ],
};

function capacityKwh(id: ProductId): number {
  const { value, unit } = products[id].capacity;
  return unit === "Wh" ? value / 1000 : value;
}

export function batteryCandidates(
  segment: CalculatorSegment,
): BatteryCandidate[] {
  return candidateRules[segment].map(({ product, maxModules }) => ({
    id: product,
    capacityKwh: capacityKwh(product),
    usableDepth: usableDepth[product],
    maxModules,
  }));
}

/**
 * Solution page per segment for goals with solar.
 * TODO(content): no reserve-power or per-segment solar pages exist in the
 * site structure yet; reserve-only results link to the product only.
 */
export const solutionLinks: Partial<
  Record<CalculatorSegment, { href: string; serviceKey: "turnkeySes" }>
> = {
  house: { href: routes.services.turnkeySes, serviceKey: "turnkeySes" },
  business: { href: routes.services.turnkeySes, serviceKey: "turnkeySes" },
};

export const calculatorDefaults = {
  segment: "house" as CalculatorSegment,
  goal: "both" as CalculatorGoal,
  region: "lvivska",
  hours: backupHoursRange.default,
};
