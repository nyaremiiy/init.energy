import { ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { routes } from "@/content/routes";

import { DesktopNav } from "./desktop-nav";
import { offices } from "./header-data";
import { MobileMenu } from "./mobile-menu";

export function HeaderMainBar() {
  const primaryPhone = offices[0].phone;

  return (
    <Container className="flex h-20 items-center justify-between gap-6">
      <Link
        href="/"
        aria-label="INIT ENERGY — головна"
        className="relative z-50 shrink-0 text-white"
      >
        <Logo className="h-8 w-auto lg:h-10" />
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-3">
        <a
          href={primaryPhone.href}
          aria-label={`Подзвонити ${primaryPhone.display}`}
          className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Phone aria-hidden className="size-5" />
        </a>
        <Button
          href={routes.sections.contacts}
          className="hidden lg:inline-flex"
          icon={<ArrowUpRight aria-hidden className="size-4" />}
        >
          Залишити заявку
        </Button>
        <MobileMenu />
      </div>
    </Container>
  );
}
