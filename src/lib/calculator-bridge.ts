import type { CalculatorLeadData } from "@/lib/calculator-lead";

/**
 * Hands calculator parameters to the lead form on the same page through
 * window events (both are client components in different sections).
 */
export const CALCULATOR_APPLY_EVENT = "init:calculator-apply";
/** Sent by the lead form after a successful submit: calculators forget what was changed. */
export const CALCULATOR_RESET_EVENT = "init:calculator-reset";

export type CalculatorObjectType = "apartment" | "house" | "business";

export type CalculatorApplyDetail = {
  /** Only when the visitor chose the object type in the calculator: preselects it in the form. */
  objectType?: CalculatorObjectType;
  /** The object type the recommendation was worked out for (chosen or default). */
  resultObjectType: CalculatorObjectType;
  /** Chosen fields and the recommendation, e.g. «Квартира · 260 кВт·год/міс → SVIT HOME». */
  summary: string;
  /** JSON for the CRM. */
  data: CalculatorLeadData;
};

export function applyCalculatorToLeadForm(detail: CalculatorApplyDetail) {
  window.dispatchEvent(
    new CustomEvent<CalculatorApplyDetail>(CALCULATOR_APPLY_EVENT, { detail }),
  );
}

export function resetCalculators() {
  window.dispatchEvent(new Event(CALCULATOR_RESET_EVENT));
}

/** Scrolls to the lead form and puts the cursor into «Name». */
export function goToLeadForm(anchor: string) {
  const target = document.getElementById(anchor);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  target
    ?.querySelector<HTMLInputElement>('input[name="name"]')
    ?.focus({ preventScroll: true });
}
