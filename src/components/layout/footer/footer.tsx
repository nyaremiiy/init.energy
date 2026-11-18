import { ArrowUpRight, CodeXml } from "lucide-react";
import Link from "next/link";

import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/header/language-switcher";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { FooterColumns } from "./footer-columns";
import { FooterContacts } from "./footer-contacts";
import { FooterCta } from "./footer-cta";
import { FooterMark } from "./footer-mark";
import { focusClasses } from "./footer-styles";

// Rendered at build time (SSG), so the year is the build year.
const year = new Date().getFullYear();

/**
 * Site footer: CTA row, then brand · contacts · page anchors · site sections,
 * then the legal row and
 * the INIT ENERGY wordmark cropped by the panel's bottom corners.
 * No heading tags; contacts and texts come from content/ and messages/.
 */
export function Footer() {
  const messages = getMessages();
  const locale = getLocale();
  const t = messages.footer;

  const brand = (
    <div className="flex flex-col items-start gap-7">
      <Link href={localizePath(routes.home, locale)} aria-label={t.logoLabel} className={`rounded-sm text-white ${focusClasses}`}>
        <Logo className="h-auto w-22 shrink-0" />
      </Link>
      <p className="max-w-85 text-small leading-relaxed text-muted-dark">{t.description}</p>
      <nav aria-label={t.socialNavLabel}>
        <SocialLinks variant="circle" />
      </nav>
    </div>
  );

  const legalLinks = [
    { href: localizePath(routes.privacy, locale), short: t.legalShort.privacy, full: t.legal.privacy },
    { href: localizePath(routes.cookies, locale), short: t.legalShort.cookies, full: t.legal.cookies },
    { href: localizePath(routes.terms, locale), short: t.legalShort.terms, full: t.legal.terms },
  ];

  return (
    <Panel as="footer" aria-label={t.label} variant="dark" panelClassName="bg-ink-glow" className="bg-white pb-panel-sm sm:pb-panel">
      <Container inPanel className="pt-18 lg:pt-28">
        <Reveal distance={16}>
          <FooterCta />
        </Reveal>

        <Reveal delay={0.06} distance={12} className="mt-18">
          <FooterColumns brand={brand} contacts={<FooterContacts />} />
        </Reveal>

        <div className="mt-22 flex flex-col items-start gap-4 border-t border-line-dark py-7 text-caption text-muted-dark lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <p>{format(t.copyright, { year: String(year) })}</p>

          <nav aria-label={t.legalNavLabel}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} tone="dark" size="caption" aria-label={link.full} title={link.full} className="inline-flex min-h-11 items-center lg:min-h-0">
                    {link.short}
                  </NavLink>
                </li>
              ))}
              <li>
                <CookieSettingsLink compact className="min-h-11 lg:min-h-0" />
              </li>
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-6">
            <LanguageSwitcher />
            <a
              href="https://nyaremiiy.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 items-center gap-3 rounded-full ${focusClasses}`}
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-dark bg-fill-dark text-muted-dark transition-colors duration-150 ease-tech group-hover:border-muted-dark group-hover:bg-line-dark group-hover:text-white"
              >
                <CodeXml size={16} strokeWidth={1.7} />
              </span>
              <span className="flex flex-col">
                <span className="text-caption text-muted-dark">{t.developedBy}</span>
                <span className="inline-flex items-center gap-1 font-medium text-white">
                  Nazar Yaremiiy
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-dark transition duration-150 ease-tech group-hover:text-white motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </span>
              </span>
            </a>
          </div>
        </div>
      </Container>

      <FooterMark />
    </Panel>
  );
}
