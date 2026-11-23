import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";

/**
 * Ukrainian «page not found» screen with the header and footer. Not linked
 * anywhere: src/proxy.ts rewrites every unknown URL here with status 404 (the
 * address bar keeps the original URL). Living on its own route keeps the
 * chrome out of the root not-found.tsx, which Next embeds into the payload of
 * every page. Never indexed.
 */
export const metadata: Metadata = {
  title: getMessagesFor("uk").notFound.metaTitleMissing,
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  setRequestLocale("uk");
  return <NotFoundView planned={false} />;
}
