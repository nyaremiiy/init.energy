import { exceedsOutput, runtimeHours } from "./backup-runtime.ts";

export type SesCalcInput = {
  objectType: "apartment" | "house" | "business";
  goal: "savings" | "backup" | "both";
  monthlyKwh?: number;
  monthlyBill?: number;
  tariff: number;
  regionId: string;
  placement: "roof-south" | "roof-east-west" | "ground";
  roofAreaM2?: number;
  backupLoads: string[];
  backupHours: number;
  budget?: number;
};

export type SesCalcDataset<Id extends string> = {
  regions: { id: string; yield: number }[];
  monthlyShare: readonly number[];
  orientationFactor: Record<SesCalcInput["placement"], number>;
  kwStep: number;
  minKw: number;
  kwpPerM2: number;
  /** Usable share of the nominal capacity (content/storage.ts). */
  usableShare: number;
  appliances: { id: string; powerW: number }[];
  products: Record<Id, { name: string; href: string }>;
  /** Battery candidates per object type, tried in order (content/storage.ts). */
  candidates: Record<SesCalcInput["objectType"], SesStorageCandidate<Id>[]>;
};

export type SesStorageCandidate<Id extends string> = {
  id: Id;
  /** One unit, kWh. */
  capacityKwh: number;
  maxModules: number;
  /** Output of the product itself, W; undefined = no limit (separate inverter). */
  outputW?: number;
  /** Bare battery: shown with «+ hybrid inverter». */
  needsInverter: boolean;
};

export type SesCalcResult<Id extends string> = {
  monthlyKwh: number;
  kw: number;
  limitedByRoof: boolean;
  generationByMonth: number[];
  generationYear: number;
  savingsYear: number;
  paybackYears: number | null;
  battery: { id: Id; name: string; href: string; modules: number; capacityKwh: number; backupHours: number; inverterNote: boolean } | null;
  loadKw: number;
  surplus: { kwh: number; monthIndex: number };
  deficit: { kwh: number; monthIndex: number };
  plantType: "grid" | "hybrid";
};

/** Pure estimate engine. Every formula corresponds to a numbered method row on the page. */
export function calculateSesCore<Id extends string>(input: SesCalcInput, data: SesCalcDataset<Id>): SesCalcResult<Id> {
  const tariff = Math.max(input.tariff, 0);
  // 1. Monthly consumption comes from kWh or the bill divided by tariff; annual consumption is monthly × 12.
  const monthlyKwh = Math.max(0, input.monthlyKwh ?? (input.monthlyBill ?? 0) / Math.max(tariff, 0.01));
  const annual = monthlyKwh * 12;
  const region = data.regions.find((item) => item.id === input.regionId) ?? data.regions[0];
  if (!region) throw new Error("Solar-yield regions are required to calculate an estimate.");
  // 2. Regional yield is adjusted for panel orientation.
  const yieldPerKw = region.yield * data.orientationFactor[input.placement];
  // 3. Round required capacity up to the nearest step; roof area optionally caps it.
  let kw = Math.max(data.minKw, Math.ceil(annual / yieldPerKw / data.kwStep) * data.kwStep);
  let limitedByRoof = false;
  if (input.roofAreaM2 && input.roofAreaM2 > 0) {
    const roofLimit = Math.floor((input.roofAreaM2 * data.kwpPerM2) / data.kwStep) * data.kwStep;
    if (roofLimit < kw) { kw = Math.max(0, roofLimit); limitedByRoof = true; }
  }
  // 4. Monthly generation uses the shared month profile.
  const generationByMonth = data.monthlyShare.map((share) => kw * yieldPerKw * share);
  const generationYear = generationByMonth.reduce((sum, value) => sum + value, 0);
  // 5. Self-use is capped by monthly demand; annual savings equal self-used energy × tariff.
  const savingsYear = generationByMonth.reduce((sum, value) => sum + Math.min(value, monthlyKwh), 0) * tariff;
  // 6. Payback requires an estimated project budget.
  const paybackYears = input.budget && savingsYear > 0 && tariff > 0 ? input.budget / savingsYear : null;
  // 7. Sum selected loads and take the first candidate (in segment order) whose
  // usable capacity covers the need and whose own output carries the load.
  // Hours use the same formula as the autonomy table on /rezervne-zhyvlennya/.
  const loadW = data.appliances.filter((item) => input.backupLoads.includes(item.id)).reduce((sum, item) => sum + item.powerW, 0);
  const loadKw = loadW / 1000;
  const neededKwh = loadKw * input.backupHours;
  let battery: SesCalcResult<Id>["battery"] = null;
  if (input.goal !== "savings" && loadW > 0) {
    for (const candidate of data.candidates[input.objectType]) {
      if (exceedsOutput(loadW, candidate.outputW)) continue;
      const modules = Math.max(1, Math.ceil(neededKwh / (candidate.capacityKwh * data.usableShare) - 1e-9));
      if (modules > candidate.maxModules) continue;
      const capacityKwh = modules * candidate.capacityKwh;
      battery = { id: candidate.id, name: data.products[candidate.id].name, href: data.products[candidate.id].href, modules, capacityKwh, backupHours: runtimeHours(capacityKwh * 1000, loadW, data.usableShare), inverterNote: candidate.needsInverter };
      break;
    }
  }
  // 8. Find the largest monthly surplus and deficit versus consumption.
  const deltas = generationByMonth.map((generation) => generation - monthlyKwh);
  const surplusIndex = deltas.reduce((best, value, index) => value > deltas[best] ? index : best, 0);
  const deficitIndex = deltas.reduce((best, value, index) => value < deltas[best] ? index : best, 0);
  // 9. Savings-only systems are grid-tied; systems that include backup are hybrid.
  return { monthlyKwh, kw, limitedByRoof, generationByMonth, generationYear, savingsYear, paybackYears, battery, loadKw, surplus: { kwh: Math.max(0, deltas[surplusIndex]), monthIndex: surplusIndex }, deficit: { kwh: Math.max(0, -deltas[deficitIndex]), monthIndex: deficitIndex }, plantType: input.goal === "savings" ? "grid" : "hybrid" };
}
