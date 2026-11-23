import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: getMessagesFor("uk").notFound.metaTitleMissing,
  robots: { index: false, follow: true },
};

/**
 * Fallback only. Next embeds this tree into the RSC payload of every page
 * (twice), so it stays without the header and footer: with them it added
 * ~94 KB to every HTML document. Visitors never see it — src/proxy.ts
 * rewrites unknown URLs to /ne-znaideno/ (/en/ne-znaideno/), which has the
 * full chrome. Static on purpose: reading request headers here would make
 * every page of the site dynamic.
 */
export default function NotFound() {
  setRequestLocale("uk");
  return <NotFoundView planned={false} />;
}
