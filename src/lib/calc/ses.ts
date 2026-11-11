import { appliances } from "@/content/appliances";
import { insolationRegions, monthlyShare } from "@/content/insolation";
import { products, type ProductId } from "@/content/products";
import { sesCalculatorConfig, storageCandidates, type SesGoal, type SesObjectType, type SesPlacement } from "@/content/ses-calculator";

import { calculateSesCore, type SesCalcInput, type SesCalcResult } from "./ses-core";

export type SesCalculationInput = SesCalcInput;
export type SesCalculation = SesCalcResult<ProductId>;
export type { SesGoal, SesObjectType, SesPlacement };

export function calculateSes(input: SesCalculationInput): SesCalculation {
  const productData = Object.fromEntries(Object.values(products).map((product) => [product.id, { name: product.name, href: product.href }])) as Record<ProductId, { name: string; href: string }>;
  return calculateSesCore(input, {
    regions: insolationRegions,
    monthlyShare,
    orientationFactor: sesCalculatorConfig.orientationFactor,
    kwStep: sesCalculatorConfig.kwStep,
    minKw: sesCalculatorConfig.minKw,
    kwpPerM2: sesCalculatorConfig.kwpPerM2,
    usableCapacityFactor: sesCalculatorConfig.usableCapacityFactor,
    appliances,
    products: productData,
    candidates: storageCandidates,
  });
}
