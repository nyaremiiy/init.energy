import type { Metadata } from "next";

import { BackupSegments } from "@/components/sections/backup/backup-segments";
import { BackupChoice } from "@/components/sections/backup-regions/backup-choice";
import { BackupRegionLocal } from "@/components/sections/backup-regions/backup-region-local";
import { BackupRegionRuntime } from "@/components/sections/backup-regions/backup-region-runtime";
import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { PageHero } from "@/components/sections/PageHero";
import { RegionLinks } from "@/components/sections/region-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { backupHeroImage, updatedAt } from "@/content/backup";
import { backupRegionPath, regionPath, type InsolationRegion } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { backupDescription, backupFaq, backupH1, backupHeroLead, backupTitle } from "@/lib/backup-region-copy";
import { format } from "@/lib/messages";
import { isCity } from "@/lib/region-copy";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { servicePageSchema, serviceSchema } from "@/lib/seo/schema";

export function backupRegionMetadata(region: InsolationRegion, locale: Locale): Metadata {
  return buildMetadata({
    title: backupTitle(region, locale),
    description: backupDescription(region, locale),
    path: backupRegionPath(region),
    locale,
  });
}

/**
 * Backup power region page (/rezervne-zhyvlennya/{region}/ and /en/…), owner's
 * mockup 2026-11-25. Same regions, towns and offices as /cec/{region}/
 * (content/insolation.ts); hours come from the runtime calculation, the solar
 * figure from the region's yield. JSON-LD: Service (region + centre), WebPage
 * with dateModified, BreadcrumbList (PageHero), FAQPage (FaqSection).
 */
export function BackupRegionPage({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().backupRegionPage;
  const url = absoluteUrl(localizePath(backupRegionPath(region), locale));
  const title = backupTitle(region, locale);
  const calculatorHref = localizePath(routes.calculators.sesPayback, locale);
  const areas = isCity(region)
    ? [{ type: "City" as const, name: region.name[locale] }]
    : [
        { type: "AdministrativeArea" as const, name: region.name[locale] },
        { type: "City" as const, name: region.center[locale] },
      ];

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: title,
          description: backupDescription(region, locale),
          url,
          serviceType: t.meta.serviceType,
          areaServed: areas,
        })}
      />
      <JsonLd data={servicePageSchema(locale, { name: title, url, dateModified: updatedAt })} />
      <main className="pb-section-sm lg:pb-section">
        <PageHero
          spaciousMobile
          eyebrow={format(t.hero.eyebrow, { name: region.name[locale] })}
          title={backupH1(region, locale)}
          lead={backupHeroLead(region, locale)}
          primaryCta={{ label: t.hero.primary, href: `#${anchors.contacts}` }}
          secondaryCta={{ label: t.hero.secondary, href: `#${anchors.contacts}` }}
          media={{
            type: "picture",
            image: { ...backupHeroImage, fallback: backupHeroImage.desktop, type: "image/avif", position: "right" },
            alt: backupHeroImage.alt[locale],
          }}
          breadcrumbs={[
            { label: t.crumbs.home, href: localizePath(routes.home, locale) },
            { label: t.crumbs.backup, href: localizePath(routes.backup.hub, locale) },
            { label: region.name[locale] },
          ]}
        />
        <BackupChoice />
        <BackupSegments regional title={format(t.segments.title, { locative: region.locative[locale] })} lead={t.segments.lead} />
        <BackupRegionRuntime region={region} />
        <BackupRegionLocal region={region} />
        <FaqSection
          questions={backupFaq(region, locale)}
          title={format(t.faq.title, { locative: region.locative[locale] })}
          lead={t.faq.lead}
          filter={false}
          links={{
            title: t.faq.linksTitle,
            items: [
              { label: t.faq.links.calculator, href: `${calculatorHref}#${anchors.calculator}` },
              { label: t.faq.links.ses, href: localizePath(routes.services.turnkeySes, locale) },
              { label: format(t.faq.links.region, { locative: region.locative[locale] }), href: localizePath(regionPath(region), locale) },
            ],
          }}
        />
        <LeadSection commentPlaceholder={t.lead.comment} />
        <RegionLinks kind="backup" variant="other" exclude={region.id} />
      </main>
    </>
  );
}
