"use client";

import { useEffect, type ReactNode } from "react";

/** True after the first page has hydrated: later pages are client navigations. */
let navigated = false;

/**
 * Fades the page content in on client-side navigation (header and footer stay
 * put — they live in the layout). Not on the first load, so the LCP image is
 * not delayed, and never with prefers-reduced-motion. Used by template.tsx,
 * which remounts on every navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const animate = navigated;

  useEffect(() => {
    navigated = true;
  }, []);

  // flex-1: keeps short pages (404) stretched between the header and the footer.
  return <div className={`flex flex-1 flex-col ${animate ? "motion-safe:animate-enter" : ""}`}>{children}</div>;
}
