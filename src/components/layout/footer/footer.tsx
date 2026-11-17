import { ArrowUpRight, CodeXml } from "lucide-react";
import Link from "next/link";

import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Container } from "@/components/layout/container";
import { HeaderLeadCta } from "@/components/layout/header/header-lead-cta";
import { LanguageSwitcher } from "@/components/layout/header/language-switcher";
import { ContactLink } from "@/components/ui/contact-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { offices } from "@/content/company";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";
import { format } from "@/lib/messages";

import { FooterColumns } from "./footer-columns";
import { focusClasses } from "./footer-styles";
import { NewsletterForm } from "./newsletter-form";

// Rendered at build time (SSG), so the year is the build year.
const year = new Date().getFullYear();

/**
 * Site footer, variant «with a call to action»: CTA → offices → navigation →
 * newsletter → legal row. No heading tags: the footer must not add to every
 * page's outline. Contacts come from content/company.ts (same as the JSON-LD).
 */
export function Footer() {
  const messages = getMessages();
  const locale = getLocale();
  const t = messages.footer;

  const brand = (
    <div className="flex flex-col items-start gap-6">
      <Link href={localizePath(routes.home, locale)} aria-label={t.logoLabel} className={`rounded-sm text-white ${focusClasses}`}>
        <Logo className="h-auto w-24 shrink-0" />
      </Link>
      <p className="max-w-100 text-body text-muted-dark">{t.description}</p>
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
      <Container inPanel className="pt-panel-y-sm lg:pt-section">
        {/* 1. Call to action. The title is a <p>, not a heading. */}
        <Reveal distance={16}>
          <div className="flex flex-col items-start gap-8 pb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-24">
            <div className="flex max-w-180 flex-col gap-5">
              <Eyebrow tone="dark" size="compact" as="p">
                {t.cta.eyebrow}
              </Eyebrow>
              <p className="font-heading text-h2-sm font-semibold tracking-tight text-white sm:text-h2-md md:text-hero-md lg:text-hero">
                {t.cta.title}
              </p>
            </div>
            <div className="shrink-0">
              <HeaderLeadCta />
            </div>
          </div>
        </Reveal>

        {/* 2. Offices: each cell is one tel: link. */}
        <Reveal delay={0.04} distance={12}>
          <address aria-label={t.officesLabel} className="grid grid-cols-1 border-t border-line-dark not-italic md:grid-cols-2">
            {offices.map((office, index) => {
              const phone = formatPhone(office.phone.display);
              return (
                <ContactLink
                  key={office.phone.href}
                  href={office.phone.href}
                  method="phone"
                  location="footer"
                  aria-label={format(t.callOffice, { city: office.cityIn[locale], phone })}
                  className={`group flex items-center justify-between gap-6 py-8 lg:py-10 ${focusClasses} ${index === 0 ? "md:pr-10" : "border-t border-line-dark md:border-t-0 md:border-l md:pl-10"}`}
                >
                  <span className="flex min-w-0 flex-col gap-3">
                    <Eyebrow tone="dark" size="compact" as="span">
                      {office.city[locale]}
                    </Eyebrow>
                    <span className="font-heading text-h3 font-medium whitespace-nowrap text-white tabular-nums lg:text-h2-sm">{phone}</span>
                    <span className="text-small text-muted-dark">{office.address[locale]}</span>
                  </span>
                  <IconButton decorative variant="outline-dark" size="md" icon="phone" />
                </ContactLink>
              );
            })}
          </address>
        </Reveal>

        {/* 3. Navigation. */}
        <Reveal delay={0.08} distance={12}>
          <div className="border-t border-line-dark pt-16 lg:pt-20">
            <FooterColumns brand={brand} />
          </div>
        </Reveal>

        {/* 4. Newsletter. */}
        <Reveal delay={0.1} distance={12}>
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-line-dark py-12 lg:mt-24 lg:grid-cols-11 lg:items-center lg:gap-20">
            <div className="flex flex-col gap-4 lg:col-span-5">
              <Eyebrow tone="dark" size="compact" as="p">
                {t.newsletter.title}
              </Eyebrow>
              <p className="text-body text-muted-dark">{t.newsletter.text}</p>
            </div>
            <div className="lg:col-span-6">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>

        {/* 5. Copyright · legal · language and credit. */}
        <div className="flex flex-col gap-6 border-t border-line-dark py-8 text-caption text-muted-dark lg:flex-row lg:items-center lg:justify-between lg:gap-8">
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
                <CookieSettingsLink className="min-h-11 lg:min-h-0" />
              </li>
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-6">
            <LanguageSwitcher variant="pill" />
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
    </Panel>
  );
}
