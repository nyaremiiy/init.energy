import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";

/**
 * English «page not found» screen. Not linked anywhere: src/proxy.ts rewrites
 * every /en/… URL without an English version here with status 404 (the
 * address bar keeps the original URL). The root not-found.tsx is Ukrainian
 * and cannot know the locale without reading headers. Never indexed.
 */
export const metadata: Metadata = {
  title: getMessagesFor("en").notFound.metaTitleMissing,
  robots: { index: false, follow: true },
};

export default function EnglishNotFoundPage() {
  setRequestLocale("en");
  return <NotFoundView planned={false} />;
}
