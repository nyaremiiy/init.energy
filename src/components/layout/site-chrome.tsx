import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { BackToTop } from "@/components/ui/back-to-top";
import { ContactWidget } from "@/components/ui/contact-widget";
import type { Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/client";

/** Header, footer and floating widgets around a page, in one locale. */
export function SiteChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <Header />
      {children}
      <Footer />
      <BackToTop />
      <ContactWidget />
    </LocaleProvider>
  );
}
