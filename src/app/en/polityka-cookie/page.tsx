import type { Metadata } from "next";

import { CookiePolicyPage, cookiePolicyMetadata } from "@/components/pages/cookie-policy-page";
import { setRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  return cookiePolicyMetadata("en");
}

export default function EnglishCookiePolicyRoute() {
  setRequestLocale("en");
  return <CookiePolicyPage locale="en" />;
}
