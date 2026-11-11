import type { Metadata } from "next";
import { headers } from "next/headers";

import { SiteChrome } from "@/components/layout/site-chrome";
import { NotFoundView } from "@/components/pages/not-found-view";
import { plannedPaths } from "@/content/routes";
import { localePrefix, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";
import { pathnameHeader } from "@/lib/request-path";

async function requestInfo(): Promise<{ locale: Locale; planned: boolean }> {
  const raw = (await headers()).get(pathnameHeader) ?? "/";
  const path = raw.endsWith("/") ? raw : `${raw}/`;
  const english = path.startsWith(`${localePrefix.en}/`);
  // English URLs of planned pages are planned too: compare without "/en".
  const base = english ? path.slice(localePrefix.en.length) : path;
  return { locale: english ? "en" : "uk", planned: plannedPaths.includes(base) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, planned } = await requestInfo();
  const t = getMessagesFor(locale).notFound;
  return {
    title: planned ? t.metaTitle : t.metaTitleMissing,
    robots: { index: false, follow: true },
  };
}

/**
 * Every 404 (unmatched URL or notFound()). The root layout has no header or
 * footer, so the chrome is added here in the locale of the requested path.
 * Pages that are linked but not built yet (`plannedPaths`) say «page in progress».
 */
export default async function NotFound() {
  const { locale, planned } = await requestInfo();
  setRequestLocale(locale);
  const view = (
    <SiteChrome locale={locale}>
      <NotFoundView planned={planned} />
    </SiteChrome>
  );

  return locale === "en" ? (
    <div lang="en" className="contents">
      {view}
    </div>
  ) : (
    view
  );
}
