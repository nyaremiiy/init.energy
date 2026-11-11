import type { Metadata } from "next";

import { SiteChrome } from "@/components/layout/site-chrome";
import { NotFoundView } from "@/components/pages/not-found-view";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: getMessagesFor("uk").notFound.metaTitleMissing,
  robots: { index: false, follow: true },
};

/**
 * Every unmatched URL and notFound(). Static on purpose: reading request
 * headers here would make every page of the site dynamic. The root layout
 * has no header or footer, so the chrome is added here. Planned pages never
 * reach this file — src/proxy.ts rewrites them to /v-rozrobtsi/.
 */
export default function NotFound() {
  setRequestLocale("uk");

  return (
    <SiteChrome locale="uk">
      <NotFoundView planned={false} />
    </SiteChrome>
  );
}
