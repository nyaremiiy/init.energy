import { ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";
import { formatPhone } from "@/lib/format";

import { DesktopNav } from "./desktop-nav";
import { offices } from "./header-data";
import { MobileMenu } from "./mobile-menu";

export function HeaderMainBar() {
  const primaryPhone = offices[0].phone;
  const locale = getLocale();
  const t = getMessages().chrome.header;

  return (
    <Container className="flex h-20 items-center justify-between gap-6">
      <Link
        href={localizePath("/", locale)}
        aria-label={t.homeLabel}
        className="relative z-50 shrink-0 text-white"
      >
        <Logo className="h-auto w-14 shrink-0 lg:w-18" />
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-3">
        <a
          href={primaryPhone.href}
          aria-label={format(t.call, {
            phone: formatPhone(primaryPhone.display),
          })}
          className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Phone aria-hidden className="size-5" />
        </a>
        <div className="hidden shrink-0 lg:block">
          <Button
            className="whitespace-nowrap"
            href={localizePath(routes.calculators.sesPayback, locale)}
            icon={<ArrowUpRight aria-hidden className="size-4" />}
          >
            {t.cta}
          </Button>
        </div>
        <MobileMenu />
      </div>
    </Container>
  );
}
