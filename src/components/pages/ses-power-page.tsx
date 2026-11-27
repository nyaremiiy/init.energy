import type { Metadata } from "next";

import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { PageHero } from "@/components/sections/PageHero";
import { RegionLinks } from "@/components/sections/region-links";
import { PowerCalculatorSection } from "@/components/sections/ses-power/power-calculator-section";
import { PowerFigures } from "@/components/sections/ses-power/power-figures";
import { PowerOthers } from "@/components/sections/ses-power/power-others";
import { PowerOutage } from "@/components/sections/ses-power/power-outage";
import { PowerRegions } from "@/components/sections/ses-power/power-regions";
import { PowerTurnkey } from "@/components/sections/ses-power/power-turnkey";
import { PowerTypes } from "@/components/sections/ses-power/power-types";
import { PowerYield } from "@/components/sections/ses-power/power-yield";
import { JsonLd } from "@/components/seo/JsonLd";
import { anchors, routes } from "@/content/routes";
import { sesPowerPath, type SesPowerPage as SesPowerPageData } from "@/content/ses-power";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { powerDescription, powerFaq, powerHeroLead, powerTitle } from "@/lib/ses-power-copy";
import { powerFacts } from "@/lib/ses-power-facts";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { servicePageSchema, serviceSchema } from "@/lib/seo/schema";

export function sesPowerMetadata(page: SesPowerPageData, locale: Locale): Metadata {
  return buildMetadata({
    title: powerTitle(page, locale),
    description: powerDescription(page, powerFacts(page), locale),
    path: sesPowerPath(page),
    locale,
  });
}

/**
 * «Solar plant by power» template (/cec/5-kvt/ …, owner's brief 2026-11-27):
 * one component for every power in content/ses-power.ts. Dark hero → white
 * figures → light chart → sky calculator → white regions → dark turnkey →
 * light plant types → dark outages (never two dark sections in a row).
 */
export function SesPowerPage({ page, locale }: { page: SesPowerPageData; locale: Locale }) {
  const t = getMessages().sesPower;
  const facts = powerFacts(page);
  const kw = formatNumber(page.kw, locale);
  const url = absoluteUrl(localizePath(sesPowerPath(page), locale));
  const title = powerTitle(page, locale);

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: title,
          description: powerDescription(page, facts, locale),
          url,
          serviceType: format(t.meta.serviceType, { kw }),
        })}
      />
      <JsonLd data={servicePageSchema(locale, { name: format(t.meta.pageName, { kw }), url, dateModified: page.updatedAt })} />
      <main className="pb-section-sm lg:pb-section">
        <PageHero
          spaciousMobile
          eyebrow={format(t.hero.eyebrow, { kw })}
          title={format(t.hero.title, { kw })}
          lead={powerHeroLead(facts, locale)}
          primaryCta={{ label: t.hero.primary, href: `#${anchors.contacts}` }}
          secondaryCta={{ label: t.hero.secondary, href: `#${anchors.calculator}` }}
          media={{ type: "picture", image: page.hero.image, alt: page.hero.alt[locale] }}
          breadcrumbs={[
            { label: t.crumbs.home, href: localizePath(routes.home, locale) },
            { label: t.crumbs.ses, href: localizePath(routes.services.turnkeySes, locale) },
            { label: format(t.crumbs.current, { kw }) },
          ]}
        />
        <PowerFigures page={page} facts={facts} locale={locale} />
        <PowerYield facts={facts} locale={locale} />
        <PowerCalculatorSection page={page} facts={facts} locale={locale} />
        <PowerRegions facts={facts} locale={locale} />
        <PowerTurnkey kw={page.kw} locale={locale} />
        <PowerTypes facts={facts} locale={locale} />
        <PowerOutage facts={facts} locale={locale} />
        <FaqSection
          questions={powerFaq(page, facts, locale)}
          title={format(t.faq.title, { kw })}
          lead={t.faq.lead}
          filter={false}
          links={{
            title: t.faq.linksTitle,
            items: [
              { label: t.faq.links.calculator, href: localizePath(routes.calculators.sesPayback, locale) },
              { label: t.faq.links.ses, href: localizePath(routes.services.turnkeySes, locale) },
              { label: t.faq.links.backup, href: localizePath(routes.backup.hub, locale) },
            ],
          }}
        />
        <LeadSection defaultObjectType={page.segment === "business" ? "business" : "house"} commentPlaceholder={format(t.lead.comment, { kw })} />
        <PowerOthers kw={page.kw} locale={locale} />
        <RegionLinks variant="all" kind="solar" />
      </main>
    </>
  );
}
