import { products, type ProductId } from "./products";

/**
 * Battery data shared by both calculators (home page, /kalkulyator/okupnist-ses/)
 * and the autonomy table on /rezervne-zhyvlennya/. One source, so the same
 * product and load give the same hours everywhere.
 */

/**
 * Usable share of the nominal capacity (typical depth of discharge for LiFePO₄).
 * TODO(content): products.ts has no DoD per product yet — confirm 0.9 for every model.
 */
export const usableShare = 0.9;

export type StorageSegment = "apartment" | "house" | "business";

/**
 * Battery candidates per segment, tried in order; the first one that covers
 * the need wins. Module limits come from `products[id].maxParallel`.
 * SVIT PLUS 16000 stays a single unit until parallel connection is confirmed.
 */
export const storageOrder: Record<StorageSegment, ProductId[]> = {
  // Apartments: no panels, batteries charge from the grid.
  apartment: ["svit600", "svitHome", "svitPlus5000"],
  house: ["svitHome", "svitPlus5000", "svitPlus16000"],
  business: ["svitPlus16000", "svitPlus5000", "lithiumvalley"],
};

/** Nominal capacity of one unit (one block for LITHIUMVALLEY), Wh. */
export function capacityWh(id: ProductId): number {
  const capacity = products[id].capacity;
  return capacity.unit === "kWh" ? capacity.value * 1000 : capacity.value;
}

export function capacityKwh(id: ProductId): number {
  return capacityWh(id) / 1000;
}

/**
 * Output limit in W: the station's power or the kit's inverter. None for a
 * bare battery (its inverter is chosen for the project) or a BESS module
 * (inverter sized per project).
 */
export function outputLimitW(id: ProductId): number | undefined {
  if (products[id].inverter === "separate") return undefined;
  const spec = products[id].specs.find((item) => item.key === "power" || item.key === "inverter");
  const value = spec && typeof spec.value === "object" && "unit" in spec.value ? spec.value : undefined;
  if (!value) return undefined;
  if (value.unit === "kW") return value.value * 1000;
  if (value.unit === "W") return value.value;
  return undefined;
}

export type StorageCandidate = {
  id: ProductId;
  /** One unit, kWh. */
  capacityKwh: number;
  maxModules: number;
  /** W; undefined = no limit of its own. */
  outputW?: number;
  /** Bare battery: shown with «+ hybrid inverter». */
  needsInverter: boolean;
};

export function storageCandidates(segment: StorageSegment): StorageCandidate[] {
  return storageOrder[segment].map((id) => ({
    id,
    capacityKwh: capacityKwh(id),
    maxModules: products[id].maxParallel,
    outputW: outputLimitW(id),
    needsInverter: products[id].inverter === "separate",
  }));
}

/** SVIT models any calculator can recommend (the «models» fact on the calculator page). */
export const svitModelCount = new Set(
  Object.values(storageOrder)
    .flat()
    .filter((id) => products[id].brand === "SVIT"),
).size;
