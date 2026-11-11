/**
 * UTM tags and ad click IDs for the lead form. Kept only for the session
 * (sessionStorage) until marketing consent; with it, also in a first-party
 * cookie for 90 days. They are sent with a lead as part of the request
 * itself (legitimate interest). TODO(content): mention in the cookie policy
 * after the legal review.
 */
export const trackingKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

type Tracking = Partial<Record<(typeof trackingKeys)[number], string>>;

const storageKey = "init_tracking";
const cookieMaxAge = 90 * 24 * 3600;

function fromUrl(): Tracking {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(trackingKeys.flatMap((key) => (params.get(key) ? [[key, params.get(key)!.slice(0, 200)]] : [])));
}

function fromSession(): Tracking {
  try {
    return JSON.parse(window.sessionStorage.getItem(storageKey) ?? "{}") as Tracking;
  } catch {
    return {};
  }
}

function fromCookie(): Tracking {
  const match = document.cookie.split("; ").find((part) => part.startsWith(`${storageKey}=`));
  try {
    return match ? (JSON.parse(decodeURIComponent(match.slice(storageKey.length + 1))) as Tracking) : {};
  } catch {
    return {};
  }
}

/** On every page: keeps the landing tags for the session; with marketing consent, in a cookie too. */
export function captureTracking(marketing: boolean): void {
  const landing = fromUrl();
  const session = { ...fromSession(), ...landing };
  try {
    if (Object.keys(landing).length) window.sessionStorage.setItem(storageKey, JSON.stringify(session));
  } catch {
    // Storage blocked: the form still reads the current URL.
  }
  if (marketing && Object.keys(session).length) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${storageKey}=${encodeURIComponent(JSON.stringify({ ...fromCookie(), ...session }))}; path=/; max-age=${cookieMaxAge}; SameSite=Lax${secure}`;
  }
}

/** Drops the cookie copy when marketing consent is withdrawn. */
export function clearTrackingCookie(): void {
  document.cookie = `${storageKey}=; path=/; max-age=0`;
}

/** Values for the lead form: current URL, then this session, then the consented cookie. */
export function storedTracking(): Tracking {
  return { ...fromCookie(), ...fromSession(), ...fromUrl() };
}
