type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    /** Set by the consent head script and ConsentProvider (lib/consent). */
    initConsent?: { analytics?: boolean; marketing?: boolean };
  }
}

/** True once the visitor allowed analytics cookies (cookie banner / settings). */
export function hasAnalyticsConsent(): boolean {
  return (
    typeof window !== "undefined" && window.initConsent?.analytics === true
  );
}

/** Pushes to the GTM dataLayer only after analytics consent. */
export function trackEvent(event: DataLayerEvent): void {
  if (!hasAnalyticsConsent()) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}
