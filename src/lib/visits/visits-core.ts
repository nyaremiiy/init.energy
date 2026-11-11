/**
 * Pure logic of the visit counter: Kyiv dates, the daily report schedule,
 * input checks and aggregation. No file system and no "@/" imports, so the
 * tests run it directly with `node --test`.
 */

export const timeZone = "Europe/Kyiv";

/** One page view: Kyiv-day visitor hash (not reversible), page path, external referrer host. */
export type VisitEvent = {
  /** ISO time of the view. */
  t: string;
  path: string;
  /** Salted hash of IP + browser, the salt changes every day and is deleted after the report. */
  v: string;
  /** Host of an external referrer on the first page of a visit (google.com, t.me …). */
  ref?: string;
};

export type VisitReport = {
  /** Kyiv date the report covers, YYYY-MM-DD. */
  date: string;
  timeZone: string;
  /** Unique visitors that day. */
  visitors: number;
  pageViews: number;
  /** Pages by views, most viewed first. */
  pages: Array<{ path: string; views: number; visitors: number }>;
  /** External sources by visits, most first. */
  referrers: Array<{ host: string; visits: number }>;
  generatedAt: string;
};

/** Wall-clock parts of `date` in Kyiv. */
function kyivParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

/** Kyiv calendar date of `date`, YYYY-MM-DD. */
export function kyivDate(date: Date): string {
  return kyivParts(date).date;
}

/** Milliseconds from `now` until the next `hour`:00 in Kyiv (03:00 by default). */
export function msUntilKyivHour(now: Date, hour = 3): number {
  const { hour: h, minute, second } = kyivParts(now);
  const secondsNow = h * 3600 + minute * 60 + second;
  let delta = hour * 3600 - secondsNow;
  if (delta <= 0) delta += 24 * 3600;
  return delta * 1000 - now.getMilliseconds();
}

const botPattern = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pagespeed|monitor|curl|wget|python|axios|node-fetch/i;

/** Crawlers, link previews and monitoring tools are not visitors. */
export function isBot(userAgent: string | null): boolean {
  return !userAgent || botPattern.test(userAgent);
}

/** A page path from the client: "/…", no query or hash, sane length; otherwise null. */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/)[0];
  if (path.length > 200 || /[\s<>"]/.test(path)) return null;
  return path.endsWith("/") ? path : `${path}/`;
}

/** Host of an external referrer, or undefined for direct visits and our own pages. */
export function referrerHost(raw: unknown, ownHost: string | null): string | undefined {
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    return host && host !== ownHost?.replace(/^www\./, "").split(":")[0] ? host.slice(0, 100) : undefined;
  } catch {
    return undefined;
  }
}

/** Daily report from the raw events of one Kyiv day. */
export function aggregate(date: string, events: VisitEvent[], now = new Date()): VisitReport {
  const pages = new Map<string, { views: number; visitors: Set<string> }>();
  const referrers = new Map<string, number>();
  const visitors = new Set<string>();

  for (const event of events) {
    visitors.add(event.v);
    const page = pages.get(event.path) ?? { views: 0, visitors: new Set<string>() };
    page.views += 1;
    page.visitors.add(event.v);
    pages.set(event.path, page);
    if (event.ref) referrers.set(event.ref, (referrers.get(event.ref) ?? 0) + 1);
  }

  return {
    date,
    timeZone,
    visitors: visitors.size,
    pageViews: events.length,
    pages: [...pages]
      .map(([path, page]) => ({ path, views: page.views, visitors: page.visitors.size }))
      .sort((a, b) => b.views - a.views || a.path.localeCompare(b.path)),
    referrers: [...referrers]
      .map(([host, visits]) => ({ host, visits }))
      .sort((a, b) => b.visits - a.visits || a.host.localeCompare(b.host)),
    generatedAt: now.toISOString(),
  };
}
