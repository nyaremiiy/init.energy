import type { Metadata } from "next";

import { SesPaybackPage, sesPaybackMetadata } from "@/components/pages/ses-payback-page";
import { setRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  return sesPaybackMetadata("en");
}

export default async function EnglishSesPaybackRoute({ searchParams }: PageProps<"/en/kalkulyator/okupnist-ses">) {
  setRequestLocale("en");
  return <SesPaybackPage locale="en" query={await searchParams} />;
}
