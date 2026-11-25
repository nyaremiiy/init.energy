import { Battery, Gauge, ReceiptText, ShieldCheck, Wrench } from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/container";
import { BackupCompare } from "@/components/sections/backup/backup-compare";
import { BackupEquipment } from "@/components/sections/backup/backup-equipment";
import { BackupHow } from "@/components/sections/backup/backup-how";
import { BackupRegions } from "@/components/sections/backup/backup-regions";
import { BackupRuntime } from "@/components/sections/backup/backup-runtime";
import { BackupSegments } from "@/components/sections/backup/backup-segments";
import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { PageHero } from "@/components/sections/PageHero";
import { StepsSection } from "@/components/sections/steps-section";
import { TrustSection } from "@/components/sections/trust-section";
import { PromoBanner } from "@/components/ui/promo-banner";
import { Reveal } from "@/components/ui/reveal";
import { backupHeroImage, backupSteps, updatedAt } from "@/content/backup";
import { anchors, routes, sectionHref } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { absoluteUrl } from "@/lib/seo/metadata";
import { servicePageSchema, serviceSchema } from "@/lib/seo/schema";

const stepIcons = [Gauge, Battery, ReceiptText, Wrench, ShieldCheck];

/**
 * Backup power hub (/rezervne-zhyvlennya/ and /en/rezervne-zhyvlennya/), owner's
 * mockup 2026-11-18. No projects section: there are no real backup cases yet.
 * JSON-LD: Service here; BreadcrumbList from PageHero; FAQPage from FaqSection.
 */
export function BackupPage() {
  const locale = getLocale();
  const messages = getMessages();
  const t = messages.backup;
  const pagePath = localizePath(routes.backup.hub, locale);
  const contactsHref = `${pagePath}#${anchors.contacts}`;

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: t.meta.title,
          description: t.meta.description,
          url: absoluteUrl(pagePath),
          serviceType: t.breadcrumb,
        })}
      />
      <JsonLd data={servicePageSchema(locale, { name: t.meta.title, url: absoluteUrl(pagePath), dateModified: updatedAt })} />
      <main className="pb-section-sm lg:pb-section">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={t.hero.title}
          lead={t.hero.lead}
          primaryCta={{ label: t.hero.primary, href: contactsHref }}
          secondaryCta={{ label: t.hero.secondary, href: contactsHref }}
          media={{
            type: "picture",
            image: { ...backupHeroImage, fallback: backupHeroImage.desktop, type: "image/avif", position: "right" },
            alt: backupHeroImage.alt[locale],
          }}
          breadcrumbs={[{ label: t.home, href: localizePath(routes.home, locale) }, { label: t.breadcrumb }]}
        />
        <BackupSegments />
        <BackupHow />
        <BackupEquipment />
        <BackupRuntime />

        <div className="pt-section-sm lg:pt-section">
          <Container>
            <Reveal>
              <PromoBanner
                tone="dark"
                title={t.promo.title}
                description={t.promo.description}
                cta={{ label: t.promo.cta, href: localizePath(routes.services.turnkeySes, locale) }}
                image={{ src: "/images/home/promo/ses-roof-1920.avif", alt: messages.solutionsBySegment.hub.imageAlt }}
              />
            </Reveal>
          </Container>
        </div>

        <BackupRegions />
        <BackupCompare />
        <TrustSection />
        <StepsSection
          id={anchors.backupSteps}
          titleId="backup-steps-title"
          eyebrow={t.steps.eyebrow}
          title={t.steps.title}
          lead={t.steps.lead}
          steps={backupSteps.map((step) => ({ title: step.title[locale], text: step.text[locale] }))}
          icons={stepIcons}
          watermark="STEPS"
        />
        <FaqSection
          page="backup"
          title={t.faq.title}
          lead={t.faq.lead}
          filter={false}
          links={{
            title: t.faq.linksTitle,
            items: [
              { label: t.faq.links.calculator, href: localizePath(routes.calculators.sesPayback, locale) },
              { label: t.faq.links.solar, href: localizePath(routes.services.turnkeySes, locale) },
              { label: t.faq.links.compare, href: sectionHref(anchors.compare, locale) },
            ],
          }}
        />
        {/* No «by region» block above the footer: BackupRegions above already links to every region. */}
        <LeadSection />
      </main>
    </>
  );
}
