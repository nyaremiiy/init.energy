import type { Metadata } from "next";

import { SesPaybackPage, sesPaybackMetadata } from "@/components/pages/ses-payback-page";
import { setRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  return sesPaybackMetadata("uk");
}

export default async function SesPaybackRoute({ searchParams }: PageProps<"/kalkulyator/okupnist-ses">) {
  setRequestLocale("uk");
  return <SesPaybackPage locale="uk" query={await searchParams} />;
}
