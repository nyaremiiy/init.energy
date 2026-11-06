type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    /** Set by the cookie consent banner once the visitor accepts analytics. */
    initConsent?: { analytics?: boolean };
  }
}

/**
 * TODO(integration): there is no cookie consent banner yet, so this returns
 * false and no events are sent. Wire it to the consent manager when it exists.
 */
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
