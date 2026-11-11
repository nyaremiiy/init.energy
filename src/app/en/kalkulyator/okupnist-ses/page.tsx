import type { Metadata } from "next";

import { SesPaybackPage, sesPaybackMetadata } from "@/components/pages/ses-payback-page";
import { setRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  return sesPaybackMetadata("en");
}

/** Static page: the calculator keeps its state on the client, not in the URL. */
export default function EnglishSesPaybackRoute() {
  setRequestLocale("en");
  return <SesPaybackPage locale="en" />;
}
