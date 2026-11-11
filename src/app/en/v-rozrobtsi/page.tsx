import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";

/**
 * «Page in progress» screen. Not linked anywhere: src/proxy.ts rewrites
 * planned URLs here (the address bar keeps the original URL). Never indexed.
 */
export const metadata: Metadata = {
  title: getMessagesFor("en").notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function InProgressPage() {
  setRequestLocale("en");
  return <NotFoundView planned />;
}
