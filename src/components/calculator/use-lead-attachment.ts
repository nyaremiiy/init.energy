"use client";

import { useEffect, useRef } from "react";

import {
  applyCalculatorToLeadForm,
  CALCULATOR_RESET_EVENT,
  type CalculatorApplyDetail,
} from "@/lib/calculator-bridge";

/**
 * Attaches calculator data to the lead form. `attach()` (the result CTA)
 * hands it over only when the visitor changed something; after that every
 * change re-sends it, so the lead carries the values at the moment of submit.
 * A successful submit (reset event) detaches and calls `onReset`.
 *
 * @returns attach — true when something was attached.
 */
export function useLeadAttachment(
  detail: CalculatorApplyDetail | null,
  onReset: () => void,
): () => boolean {
  const attached = useRef(false);
  const latest = useRef(detail);
  const resetRef = useRef(onReset);
  const key = detail ? JSON.stringify(detail) : "";

  useEffect(() => {
    latest.current = detail;
    resetRef.current = onReset;
  });

  useEffect(() => {
    if (attached.current && latest.current) applyCalculatorToLeadForm(latest.current);
  }, [key]);

  useEffect(() => {
    function reset() {
      attached.current = false;
      resetRef.current();
    }
    window.addEventListener(CALCULATOR_RESET_EVENT, reset);
    return () => window.removeEventListener(CALCULATOR_RESET_EVENT, reset);
  }, []);

  return () => {
    if (!latest.current) return false;
    attached.current = true;
    applyCalculatorToLeadForm(latest.current);
    return true;
  };
}
