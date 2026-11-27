import Link from "next/link";
import { IconButton } from "@/components/ui/icon-button";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";
import { formatPhone } from "@/lib/format";

import { DesktopNav } from "./desktop-nav";
import { HeaderLeadCta } from "./header-lead-cta";
import { mainPhone } from "@/content/company";
import { MobileMenu } from "./mobile-menu";
import { RegionsPicker } from "./regions-picker";

export function HeaderMainBar() {
  const primaryPhone = mainPhone;
  const locale = getLocale();
  const t = getMessages().chrome.header;

  return (
    // inPanel: the header sits in the hero panel — logo on the same line as the hero copy.
    <Container inPanel data-header-bar className="flex h-20 items-center justify-between gap-6">
      <Link
        href={localizePath("/", locale)}
        aria-label={t.homeLabel}
        className="relative z-50 shrink-0 text-white"
      >
        <Logo className="h-auto w-14 shrink-0 lg:w-18" />
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-3">
        <IconButton
          href={primaryPhone.href}
          aria-label={format(t.call, {
            phone: formatPhone(primaryPhone.display),
          })}
          variant="outline-dark"
          size="sm"
          icon="phone"
          className="relative z-50 lg:hidden"
        />
        <div className="hidden shrink-0 lg:block">
          <HeaderLeadCta />
        </div>
        <MobileMenu regions={<RegionsPicker variant="mobile" />} />
      </div>
    </Container>
  );
}
