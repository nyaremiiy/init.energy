import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  const t = getMessagesFor("en").meta;
  return buildMetadata({
    title: t.homeTitle,
    description: t.homeDescription,
    path: "/",
    locale: "en",
  });
}

export default function EnglishHome() {
  setRequestLocale("en");
  return <HomePage />;
}
