import Link from "next/link";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/header/language-switcher";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Logo } from "@/components/ui/logo";
import { Panel } from "@/components/ui/panel";
import { SocialLinks } from "@/components/ui/social-links";
import { getSiteSections } from "@/content/navigation";
import { routes } from "@/content/routes";
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
      <Eyebrow tone="dark" as="p" className="mb-5">
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
      <Eyebrow tone="dark" as="p">
        {t.newsletter.title}
      </Eyebrow>
      <p className="text-small text-white/75">{t.newsletter.text}</p>
      <NewsletterForm />
    </div>
  );

  const legalLinks = [
    { href: routes.privacy, label: t.legal.privacy },
    { href: routes.cookies, label: t.legal.cookies },
    { href: routes.terms, label: t.legal.terms },
  ];

  return (
    <Panel
      as="footer"
      variant="dark"
      panelClassName="bg-ink-glow"
      className="bg-white pb-panel-sm sm:pb-panel"
    >
      <Container inPanel className="py-panel-y-sm lg:py-panel-y">
        <FooterColumns
          brand={brand}
          sections={sections}
          newsletter={newsletter}
        />

        <div className="mt-18 flex flex-col gap-4 border-t border-white/14 pt-6 text-sm text-white/75 lg:flex-row lg:items-center lg:justify-between">
          <p>{format(t.copyright, { year: String(year) })}</p>
          <nav aria-label={t.legalNavLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
            </ul>
          </nav>
        </div>
      </Container>

      <FooterMark />
    </Panel>
  );
}
