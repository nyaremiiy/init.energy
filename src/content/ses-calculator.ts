import { products, type ProductId } from "./products";

export const updatedAt = "2026-11-11" as const;
export const sesCalculatorConfig = {
  kwStep: 0.5,
  minKw: 1,
  consumption: { min: 100, max: 1200, default: 450, step: 10 },
  backupHours: { min: 2, max: 24, default: 8 },
  // confirm with INIT ENERGY engineer
  orientationFactor: { "roof-south": 1, "roof-east-west": 0.85, ground: 1 },
  // confirm with INIT ENERGY engineer
  kwpPerM2: 0.18,
  usableCapacityFactor: 1,
  defaults: { objectType: "house", goal: "both", regionId: "lvivska", placement: "roof-south" },
} as const;

export type SesObjectType = "apartment" | "house" | "business";
export type SesGoal = "savings" | "backup" | "both";
export type SesPlacement = keyof typeof sesCalculatorConfig.orientationFactor;

export type StorageCandidate = {
  id: ProductId;
  capacityKwh: number;
  inverterKw?: number;
  stackable?: boolean;
  maxModules: number;
  segments: SesObjectType[];
};

const capacity = (id: ProductId) => {
  const quantity = products[id].capacity;
  return quantity.unit === "Wh" ? quantity.value / 1000 : quantity.value;
};

// Product links and segment fit live in content, not in the calculator view.
export const storageCandidates: StorageCandidate[] = [
  { id: "svit600", capacityKwh: capacity("svit600"), inverterKw: 0.6, maxModules: 1, segments: ["apartment"] },
  { id: "svitHome", capacityKwh: capacity("svitHome"), inverterKw: 6, maxModules: 1, segments: ["apartment", "house"] },
  { id: "svitPlus5000", capacityKwh: capacity("svitPlus5000"), stackable: true, maxModules: 6, segments: ["house", "business"] },
  { id: "svitPlus16000", capacityKwh: capacity("svitPlus16000"), maxModules: 1, segments: ["house", "business"] },
  { id: "lithiumvalley", capacityKwh: 208, inverterKw: 50, stackable: true, maxModules: 4, segments: ["business"] },
];

export const sesCalculatorProductCount = storageCandidates.filter(({ id }) => products[id].brand === "SVIT").length;

export type TypicalPlanId = "house" | "bigHouse" | "smallBusiness" | "industry";

/**
 * «Typical solar plants by size» on the calculator page. Capacity is worked
 * out by the calculator itself (Lviv region, south-facing roof) from the
 * monthly consumption; the battery follows the segment (as in solutions.ts).
 * TODO(content): owner to confirm consumption levels and battery per segment.
 */
export const typicalPlans: Array<{
  id: TypicalPlanId;
  objectType: SesObjectType;
  monthlyKwh: number;
  battery: ProductId;
  /** Battery modules shown as «× n»; 1 = single unit. */
  modules: number;
  tone: "sky" | "surface" | "navy" | "ink";
}> = [
  { id: "house", objectType: "house", monthlyKwh: 450, battery: "svitHome", modules: 1, tone: "sky" },
  { id: "bigHouse", objectType: "house", monthlyKwh: 900, battery: "svitPlus5000", modules: 2, tone: "surface" },
  { id: "smallBusiness", objectType: "business", monthlyKwh: 2000, battery: "svitPlus16000", modules: 1, tone: "navy" },
  { id: "industry", objectType: "business", monthlyKwh: 10000, battery: "lithiumvalley", modules: 1, tone: "ink" },
];
