import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { BackToTop } from "@/components/ui/back-to-top";
import { ContactWidget } from "@/components/ui/contact-widget";
import { ToastProvider } from "@/components/ui/toast";
import { VisitBeacon } from "@/components/layout/visit-beacon";
import { ConsentScripts } from "@/components/consent/ConsentScripts";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { ConsentProvider } from "@/lib/consent/ConsentProvider";
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
      <ConsentProvider>
      <ToastProvider>
        {/* First in the DOM: reachable with Tab right away, without stealing focus. */}
        <CookieBanner />
        <Header />
        {children}
        <Footer />
        <BackToTop />
        <ContactWidget />
        <VisitBeacon />
        <ConsentScripts />
      </ToastProvider>
      </ConsentProvider>
    </LocaleProvider>
  );
}
