/**
 * Cookie consent: types, storage and the Google Consent Mode v2 mapping.
 * Storage is a first-party cookie `init_consent` (JSON), mirrored to
 * localStorage only as a fallback. Browser-only helpers check `document`.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
  updatedAt: string;
};

/** Raise to ask everyone again (e.g. a new category or a new tool). */
export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = "init_consent";
/** 12 months: after that the banner is shown again. */
export const CONSENT_MAX_AGE_DAYS = 365;

export type ConsentMethod = "accept_all" | "reject_all" | "custom";

/** Consent Mode v2 signals for a decision. */
export function consentModeSignals(state: Pick<ConsentState, "analytics" | "marketing">) {
  const ads = state.marketing ? "granted" : "denied";
  return {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  } as const;
}

/** Valid, current-version and not older than 12 months; otherwise null. */
export function parseConsent(raw: string | null | undefined, now = Date.now()): ConsentState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentState>;
    if (value.version !== CONSENT_VERSION || typeof value.updatedAt !== "string") return null;
    const age = now - Date.parse(value.updatedAt);
    if (!(age >= 0) || age > CONSENT_MAX_AGE_DAYS * 24 * 3600 * 1000) return null;
    return {
      necessary: true,
      analytics: value.analytics === true,
      marketing: value.marketing === true,
      version: CONSENT_VERSION,
      updatedAt: value.updatedAt,
    };
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Saved decision (cookie first, localStorage fallback), or null. */
export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const fromCookie = parseConsent(readCookie(CONSENT_COOKIE));
  if (fromCookie) return fromCookie;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_COOKIE));
  } catch {
    return null;
  }
}

export function hasDecision(): boolean {
  return readConsent() !== null;
}

export function writeConsent(state: ConsentState): void {
  const value = encodeURIComponent(JSON.stringify(state));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE_DAYS * 24 * 3600}; SameSite=Lax${secure}`;
  try {
    window.localStorage.setItem(CONSENT_COOKIE, JSON.stringify(state));
  } catch {
    // Private mode or blocked storage: the cookie is enough.
  }
}

/** Cookies set by analytics and ad tags; deleted when consent is withdrawn. */
const trackingCookiePatterns = [/^_ga/, /^_gid$/, /^_gat/, /^_fbp$/, /^_fbc$/, /^_gcl_/, /^_ttp$/, /^_tt_/];

export function deleteTrackingCookies(category: "analytics" | "marketing" | "all"): void {
  const analytics = [/^_ga/, /^_gid$/, /^_gat/];
  const patterns = category === "all" ? trackingCookiePatterns : category === "analytics" ? analytics : trackingCookiePatterns.filter((pattern) => !analytics.includes(pattern));
  const host = window.location.hostname;
  // The current host, the registrable domain (.init.energy) and its parent.
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  for (const part of document.cookie.split("; ")) {
    const name = part.split("=")[0];
    if (!patterns.some((pattern) => pattern.test(name))) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; max-age=0${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Inline <head> script, before any tag: Consent Mode v2 defaults (all
 * denied), then an immediate update from the saved cookie, the
 * `consent_default` event and `window.initConsent` for trackEvent().
 */
export const consentHeadScript = `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
window.dataLayer.push({event:'consent_default'});
try{
var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
if(!m)return;
var c=JSON.parse(decodeURIComponent(m[1]));
var age=Date.now()-Date.parse(c.updatedAt);
if(c.version!==${CONSENT_VERSION}||!(age>=0)||age>${CONSENT_MAX_AGE_DAYS}*864e5)return;
var ads=c.marketing===true?'granted':'denied';
gtag('consent','update',{analytics_storage:c.analytics===true?'granted':'denied',ad_storage:ads,ad_user_data:ads,ad_personalization:ads});
window.initConsent={analytics:c.analytics===true,marketing:c.marketing===true};
}catch(e){}
})();`;
