import type { Metadata } from "next";

import { SesPage } from "@/components/pages/ses-page";
import { getMessagesFor } from "@/i18n/messages";
import { setRequestLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  const t = getMessagesFor("en").ses.meta;
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: "/cec/",
    locale: "en",
  });
}

export default function EnglishSolarPlantsRoute() {
  setRequestLocale("en");
  return <SesPage />;
}
