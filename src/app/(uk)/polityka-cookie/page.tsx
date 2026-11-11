import type { Metadata } from "next";

import { CookiePolicyPage, cookiePolicyMetadata } from "@/components/pages/cookie-policy-page";
import { setRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  return cookiePolicyMetadata("uk");
}

export default function CookiePolicyRoute() {
  setRequestLocale("uk");
  return <CookiePolicyPage locale="uk" />;
}
