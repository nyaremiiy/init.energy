import type { Metadata } from "next";

import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Description } from "@/components/ui/description";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { companyContacts } from "@/content/company";
import { cookieList, cookiePolicyText as text, cookiePolicyUpdatedAt } from "@/content/cookies";
import { routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export function cookiePolicyMetadata(locale: Locale): Metadata {
  const t = getMessagesFor(locale).cookies.policy;
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: routes.cookies,
    locale,
    image: { url: "/images/og/home.jpg", width: 1200, height: 630, alt: t.metaTitle },
  });
}

const sectionTitle = "font-heading text-h3-sm font-medium tracking-tight text-ink sm:text-h3";
const paragraph = "max-w-3xl text-base leading-relaxed text-ink/80";

/**
 * Cookie policy. Legal pages get a compact dark header (no hero photo):
 * the transparent site header needs a dark top, and a full hero would be
 * out of place here. TODO(content): legal review before launch.
 */
export function CookiePolicyPage({ locale }: { locale: Locale }) {
  const messages = getMessages();
  const t = messages.cookies;
  const path = localizePath(routes.cookies, locale);
  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", { dateStyle: "long" }).format(new Date(cookiePolicyUpdatedAt));
  const categoryTitle = (category: (typeof cookieList)[number]["category"]) => t.categories[category].title;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.policy.home, url: absoluteUrl(localizePath(routes.home, locale)) },
          { name: text.title[locale], url: absoluteUrl(path) },
        ])}
      />
      <main className="pb-section-sm lg:pb-section">
        <Panel
          as="section"
          variant="dark"
          aria-labelledby="cookie-policy-title"
          className="pt-panel-sm sm:pt-panel"
          panelClassName="bg-ink-glow shadow-soft"
        >
          <Container inPanel className="flex flex-col items-start gap-6 pt-28 pb-panel-y-sm lg:pt-36 lg:pb-panel-y">
            <Breadcrumbs
              tone="dark"
              label={messages.productPage.breadcrumbsLabel}
              items={[{ name: t.policy.home, href: localizePath(routes.home, locale) }, { name: text.title[locale] }]}
            />
            <Eyebrow tone="dark">{t.policy.eyebrow}</Eyebrow>
            <Heading as="h1" id="cookie-policy-title" className="text-hero-sm text-white md:text-hero-md lg:text-hero">
              {text.title[locale]}
            </Heading>
            <Description className="max-w-2xl">{text.lead[locale]}</Description>
            <p className="text-sm text-white/75">
              <time dateTime={cookiePolicyUpdatedAt}>{format(t.policy.updated, { date: updated })}</time>
            </p>
          </Container>
        </Panel>

        <Container className="flex flex-col gap-section-head-sm pt-section-sm lg:gap-section-head lg:pt-section">
          <section aria-labelledby="cookies-what" className="flex flex-col gap-4">
            <h2 id="cookies-what" className={sectionTitle}>{text.whatTitle[locale]}</h2>
            <p className={paragraph}>{text.whatText[locale]}</p>
          </section>

          <section aria-labelledby="cookies-categories" className="flex flex-col gap-4">
            <h2 id="cookies-categories" className={sectionTitle}>{text.categoriesTitle[locale]}</h2>
            <p className={paragraph}>{text.categoriesText[locale]}</p>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(["necessary", "analytics", "marketing"] as const).map((category) => (
                <li key={category} className="flex flex-col gap-2 rounded-3xl bg-surface p-card-sm lg:p-card">
                  <p className="font-heading text-base font-semibold text-ink">{t.categories[category].title}</p>
                  <p className="text-sm text-ink/70">{t.categories[category].text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cookies-table" className="flex flex-col gap-4">
            <h2 id="cookies-table" className={sectionTitle}>{text.tableTitle[locale]}</h2>
            {/* md+: a regular table; phones: one card per cookie (no horizontal scroll). */}
            <table className="hidden w-full border-collapse text-left text-sm md:table">
              <caption className="sr-only">{t.policy.table.caption}</caption>
              <thead>
                <tr className="border-b border-line text-ink/70">
                  <th scope="col" className="py-3 pr-6 font-medium">{t.policy.table.name}</th>
                  <th scope="col" className="py-3 pr-6 font-medium">{t.policy.table.provider}</th>
                  <th scope="col" className="py-3 pr-6 font-medium">{t.policy.table.category}</th>
                  <th scope="col" className="py-3 pr-6 font-medium">{t.policy.table.purpose}</th>
                  <th scope="col" className="py-3 font-medium">{t.policy.table.lifetime}</th>
                </tr>
              </thead>
              <tbody>
                {cookieList.map((cookie) => (
                  <tr key={cookie.name} className="border-b border-line align-top text-ink">
                    <th scope="row" className="py-4 pr-6 font-mono font-medium">{cookie.name}</th>
                    <td className="py-4 pr-6">{cookie.provider}</td>
                    <td className="py-4 pr-6">{categoryTitle(cookie.category)}</td>
                    <td className="py-4 pr-6 text-ink/80">{cookie.purpose[locale]}</td>
                    <td className="py-4 whitespace-nowrap">{cookie.lifetime[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="flex flex-col border-b border-line md:hidden">
              {cookieList.map((cookie) => (
                <li key={cookie.name} className="flex flex-col gap-1 border-t border-line py-4 text-sm text-ink">
                  <p className="font-mono font-medium">{cookie.name}</p>
                  <p className="text-ink/70">{cookie.provider} · {categoryTitle(cookie.category)} · {cookie.lifetime[locale]}</p>
                  <p>{cookie.purpose[locale]}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cookies-stats" className="flex flex-col gap-4">
            <h2 id="cookies-stats" className={sectionTitle}>{text.statsTitle[locale]}</h2>
            <p className={paragraph}>{text.statsText[locale]}</p>
          </section>

          <section aria-labelledby="cookies-change" className="flex flex-col items-start gap-4">
            <h2 id="cookies-change" className={sectionTitle}>{t.policy.changeTitle}</h2>
            <p className={paragraph}>{t.policy.changeText}</p>
            <CookieSettingsLink tone="light" className="text-base font-medium" />
          </section>

          <section aria-labelledby="cookies-contact" className="flex flex-col gap-4">
            <h2 id="cookies-contact" className={sectionTitle}>{t.policy.contactTitle}</h2>
            <p className={paragraph}>
              {t.policy.contactText}{" "}
              <a href={companyContacts.email.href} className="font-medium text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink">
                {companyContacts.email.display}
              </a>
              .
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}
