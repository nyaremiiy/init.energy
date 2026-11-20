import type { Metadata } from "next";

import { FaqSection } from "@/components/sections/home/faq-section";
import { sesOverviewHeroImage } from "@/components/sections/home/hero-slides";
import { LeadSection } from "@/components/sections/LeadSection";
import { PageHero } from "@/components/sections/PageHero";
import { RegionLinks } from "@/components/sections/region-links";
import { RegionCalculator } from "@/components/sections/regions/region-calculator";
import { RegionYield } from "@/components/sections/regions/region-yield";
import { JsonLd } from "@/components/seo/JsonLd";
import { regionPath, type InsolationRegion } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";
import { heroLead, regionDescription, regionFaq, regionTitle } from "@/lib/region-copy";
import { regionStats } from "@/lib/region-stats";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { serviceSchema } from "@/lib/seo/schema";

export function regionMetadata(region: InsolationRegion, locale: Locale): Metadata {
  return buildMetadata({
    title: regionTitle(region, locale),
    description: regionDescription(region, locale),
    path: regionPath(region),
    locale,
  });
}

/**
 * Region page (/cec/{region}/ and /en/cec/{region}/). Unique data, not a copy
 * with another city name: the yield of the region drives every figure, the
 * chart, the FAQ answers and the meta description; towns and contacts come
 * from content/insolation.ts and content/company.ts.
 */
export function RegionPage({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().regionPage;
  const stats = regionStats(region);
  const url = absoluteUrl(localizePath(regionPath(region), locale));
  const faq = regionFaq(region, locale, stats);

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: regionTitle(region, locale),
          description: regionDescription(region, locale),
          url,
          serviceType: t.meta.serviceType,
          areaServed: { type: region.areaType ?? "AdministrativeArea", name: region.name[locale] },
        })}
      />
      <main className="pb-section-sm lg:pb-section">
        <PageHero
          spaciousMobile
          eyebrow={format(t.hero.eyebrow, { name: region.name[locale] })}
          title={region.h1[locale]}
          lead={heroLead(region, locale, stats)}
          primaryCta={{ label: t.hero.primary, href: `#${anchors.calculator}` }}
          secondaryCta={{ label: t.hero.secondary, href: `#${anchors.contacts}` }}
          media={{ type: "picture", image: sesOverviewHeroImage, alt: t.hero.imageAlt }}
          breadcrumbs={[
            { label: t.crumbs.home, href: localizePath(routes.home, locale) },
            { label: t.crumbs.ses, href: localizePath(routes.services.turnkeySes, locale) },
            { label: region.name[locale] },
          ]}
        />
        <RegionYield region={region} locale={locale} />
        <RegionCalculator region={region} locale={locale} />
        <FaqSection
          questions={faq}
          title={format(t.faq.title, { locative: region.locative[locale] })}
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
        <LeadSection commentPlaceholder={t.lead.comment} />
        <RegionLinks variant="other" exclude={region.id} />
      </main>
    </>
  );
}
