"use client";

import { useEffect, useState } from "react";

/** Returns `value` once it has stayed the same for `delayMs` (screen-reader summaries, not every slider step). */
export function useDebouncedValue<T>(value: T, delayMs = 500): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return settled;
}
