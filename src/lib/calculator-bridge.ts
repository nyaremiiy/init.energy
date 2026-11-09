/**
 * Hands calculator parameters to the lead form on the same page through a
 * window event (both are client components in different sections).
 */
export const CALCULATOR_APPLY_EVENT = "init:calculator-apply";

export type CalculatorApplyDetail = {
  objectType: "apartment" | "house" | "business";
  /** Human-readable configuration shown in the form, e.g. «СЕС 5 кВт + накопичувач SVIT HOME». */
  summary: string;
  /** JSON with all inputs and the recommendation; sent to the CRM. */
  data: string;
};

export function applyCalculatorToLeadForm(detail: CalculatorApplyDetail) {
  window.dispatchEvent(
    new CustomEvent<CalculatorApplyDetail>(CALCULATOR_APPLY_EVENT, { detail }),
  );
}
