import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  const t = getMessagesFor("uk").meta;
  return buildMetadata({
    title: t.homeTitle,
    description: t.homeDescription,
    path: "/",
    locale: "uk",
    image: { url: "/images/og/home.jpg", width: 1200, height: 630, alt: t.homeTitle },
  });
}

export default function Home() {
  setRequestLocale("uk");
  return <HomePage />;
}
