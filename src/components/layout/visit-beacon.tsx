"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean };

/**
 * Counts page views for the site's own visit report (lib/visits): sends
 * the path once per page to /api/visit. No cookies, no identifiers in the
 * browser. Skipped in development and when the browser asks not to be
 * tracked (Do Not Track / Global Privacy Control).
 */
export function VisitBeacon() {
  const pathname = usePathname();
  const firstPage = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !pathname) return;
    const nav = navigator as PrivacyNavigator;
    if (nav.globalPrivacyControl || nav.doNotTrack === "1") return;

    // The referrer only matters on the first page of a visit (where they came from).
    const body = JSON.stringify({ path: pathname, ...(firstPage.current ? { ref: document.referrer } : {}) });
    firstPage.current = false;
    if (!nav.sendBeacon?.("/api/visit/", body)) {
      void fetch("/api/visit/", { method: "POST", body, keepalive: true }).catch(() => undefined);
    }
  }, [pathname]);

  return null;
}
