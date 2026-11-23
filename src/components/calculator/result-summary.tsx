"use client";

import { useDebouncedValue } from "./use-debounced-value";

/**
 * The one live region of a calculator: an sr-only status with a short
 * summary, updated 500 ms after the last change. The visible result card
 * is not live (it was read out in full on every slider step).
 */
export function ResultSummary({ text }: { text: string }) {
  const settled = useDebouncedValue(text, 500);
  return (
    <p role="status" className="sr-only">
      {settled}
    </p>
  );
}
