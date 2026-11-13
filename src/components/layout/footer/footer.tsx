import { ArrowUpRight, CodeXml } from "lucide-react";
import Link from "next/link";

import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/header/language-switcher";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Logo } from "@/components/ui/logo";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { getSiteSections } from "@/content/navigation";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { FooterColumns } from "./footer-columns";
import { FooterMark } from "./footer-mark";
import { focusClasses, footerLinkClasses } from "./footer-styles";
import { NewsletterForm } from "./newsletter-form";

// Rendered at build time (SSG), so the year is the build year.
const year = new Date().getFullYear();

export function Footer() {
  const messages = getMessages();
  const locale = getLocale();
  const t = messages.footer;

  const brand = (
    <div className="flex flex-col items-start gap-6">
      <Link
        href={routes.home}
        aria-label={t.logoLabel}
        className={`rounded-sm text-white ${focusClasses}`}
      >
        <Logo className="h-auto w-18 shrink-0" />
      </Link>
      <p className="max-w-80 text-small text-white/75">{t.description}</p>

      <nav aria-label={t.socialNavLabel}>
        <SocialLinks variant="circle" />
      </nav>

      <LanguageSwitcher />
    </div>
  );

  const sections = (
    <nav aria-label={t.sectionsTitle}>
      <Eyebrow tone="dark" size="compact" as="p" className="mb-5">
        {t.sectionsTitle}
      </Eyebrow>
      <ul className="flex flex-col gap-3">
        {getSiteSections(locale).map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={footerLinkClasses}>
              {t.links[item.labelKey]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const newsletter = (
    <div className="flex flex-col gap-5">
      <Eyebrow tone="dark" size="compact" as="p">
        {t.newsletter.title}
      </Eyebrow>
      <p className="text-small text-white/75">{t.newsletter.text}</p>
      <NewsletterForm />
    </div>
  );

  const legalLinks = [
    { href: localizePath(routes.privacy, locale), label: t.legal.privacy },
    { href: localizePath(routes.cookies, locale), label: t.legal.cookies },
    { href: localizePath(routes.terms, locale), label: t.legal.terms },
  ];

  return (
    <Panel
      as="footer"
      variant="dark"
      panelClassName="bg-ink-glow"
      className="bg-white pb-panel-sm sm:pb-panel"
    >
      <Container inPanel className="py-panel-y-sm lg:py-panel-y">
        <Reveal distance={16}>
          <FooterColumns
            brand={brand}
            sections={sections}
            newsletter={newsletter}
          />
        </Reveal>

        <Reveal delay={0.08} distance={12}>
          <div className="mt-18 flex flex-col gap-4 border-t border-white/14 pt-6 text-sm text-white/75 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1">
              <p>{format(t.copyright, { year: String(year) })}</p>
            </div>
            <nav aria-label={t.legalNavLabel}>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded-sm transition-colors duration-150 ease-tech hover:text-white ${focusClasses}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <CookieSettingsLink />
                </li>
                <li>
                  <a
                    href="https://nyaremiiy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-3 rounded-full ${focusClasses}`}
                  >
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/22 bg-white/8 text-white/80 transition-colors duration-150 ease-tech group-hover:border-white/60 group-hover:bg-white/14 group-hover:text-white"
                    >
                      <CodeXml size={16} strokeWidth={1.7} />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-caption text-white/75">
                        {t.developedBy}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-white">
                        Nazar Yaremiiy
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 shrink-0 text-white/75 transition duration-150 ease-tech group-hover:text-white motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                        />
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </Reveal>
      </Container>

      <FooterMark />
    </Panel>
  );
}
