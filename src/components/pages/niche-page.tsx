import type { Metadata } from "next";

import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { NicheBackup } from "@/components/sections/niche/niche-backup";
import { NicheBuild } from "@/components/sections/niche/niche-build";
import { NicheConsumers } from "@/components/sections/niche/niche-consumers";
import { NicheFacts } from "@/components/sections/niche/niche-facts";
import { NicheSizing } from "@/components/sections/niche/niche-sizing";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { JsonLd } from "@/components/seo/JsonLd";
import { anchors, routes, slugs, toPath } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { serviceSchema } from "@/lib/seo/schema";

/** Ukrainian path of a niche page, e.g. "/rishennya/ses-dlya-gotelyu/" (URL kept from init.energy). */
export function nichePath(page: SolutionPage): string {
  return toPath(slugs.solutions.hub, page.slug);
}

export function nicheMetadata(page: SolutionPage, locale: Locale): Metadata {
  return buildMetadata({
    title: page.meta.title[locale],
    description: page.meta.description[locale],
    path: nichePath(page),
    locale,
  });
}

/**
 * Niche solar page (/rishennya/{slug}/), e.g. hotels: the shared hero, five
 * page-specific sections, then the shared projects, FAQ and lead form.
 */
export function NichePage({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const t = getMessages().nichePage;
  const url = absoluteUrl(localizePath(nichePath(page), locale));
  const calculator = localizePath(routes.calculators.sesPayback, locale);

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: page.meta.title[locale],
          description: page.meta.description[locale],
          url,
          serviceType: page.serviceType,
        })}
      />
      <main className="pb-section-sm lg:pb-section">
        <PageHero
          spaciousMobile
          eyebrow={page.hero.eyebrow[locale]}
          title={page.hero.title[locale]}
          lead={page.hero.lead[locale]}
          // The calculator reads only `type` to preselect the segment; the canonical URL has no parameters.
          primaryCta={{ label: page.hero.primaryCta[locale], href: `${calculator}?type=business` }}
          secondaryCta={{ label: page.hero.secondaryCta[locale], href: `#${anchors.contacts}` }}
          media={
            page.hero.image
              ? {
                  type: "picture",
                  image: { ...page.hero.image, fallback: page.hero.image.desktop, type: "image/avif" },
                  alt: page.hero.image.alt[locale],
                }
              : { type: "placeholder", label: page.hero.mediaLabel[locale] }
          }
          breadcrumbs={[
            { label: t.crumbs.home, href: localizePath(routes.home, locale) },
            { label: t.crumbs.ses, href: localizePath(routes.services.turnkeySes, locale) },
            // Parent segment page (planned: shows «page in progress» until it is built).
            { label: t.crumbs.business, href: routes.services.business },
            { label: page.breadcrumb[locale] },
          ]}
        />
        <NicheFacts page={page} locale={locale} />
        <NicheConsumers page={page} locale={locale} />
        <NicheSizing page={page} locale={locale} />
        <NicheBackup page={page} locale={locale} />
        <NicheBuild page={page} locale={locale} />
        {/* TODO(content): add a hotel case; until then business projects (hidden while all are drafts). */}
        <ProjectsShowcase segment={page.projectSegment} />
        <FaqSection
          page={page.faqPage}
          title={page.faq.title[locale]}
          lead={page.faq.lead[locale]}
          filter={false}
          links={{
            title: t.faqLinksTitle,
            items: [
              { label: t.faqLinks.business, href: routes.services.business },
              { label: t.faqLinks.calculator, href: calculator },
              // TODO(content): article «Мережева чи гібридна СЕС» and hotel/business articles — link here once they exist.
            ],
          }}
        />
        <LeadSection
          defaultObjectType="hotel"
          objectTypes={["hotel", "business", "infrastructure", "other"]}
          commentPlaceholder={page.lead.comment[locale]}
        />
      </main>
    </>
  );
}
