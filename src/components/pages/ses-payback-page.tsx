import type { Metadata } from "next";

import { SesPaybackCalculator } from "@/components/calculator/ses-payback-calculator";
import { SesPaybackProvider } from "@/components/calculator/ses-payback-state";
import { Container } from "@/components/layout/container";
import { LeadSection } from "@/components/sections/LeadSection";
import { FaqSection } from "@/components/sections/home/faq-section";
import { SesPaybackHero } from "@/components/sections/ses-payback/ses-payback-hero";
import { SesPaybackMethod } from "@/components/sections/ses-payback/ses-payback-method";
import { SesPaybackPlans } from "@/components/sections/ses-payback/ses-payback-plans";
import { SesPaybackYield } from "@/components/sections/ses-payback/ses-payback-yield";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceArea } from "@/content/company";
import { defaultApplianceIds } from "@/content/appliances";
import { insolationRegions } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { sesCalculatorConfig } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { getMessages } from "@/i18n/server";
import { calculateSes } from "@/lib/calc/ses";
import { format } from "@/lib/messages";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export function sesPaybackMetadata(locale: Locale): Metadata {
  const t = getMessagesFor(locale).sesPayback;
  return buildMetadata({
    title: t.meta.title,
    description: t.meta.description,
    path: routes.calculators.sesPayback,
    locale,
  });
}

/**
 * SES payback calculator page. Static: the URL carries no parameters, so
 * there is one indexable page; the calculator state lives on the client
 * (`SesPaybackProvider`) and the server renders the default calculation.
 */
export function SesPaybackPage({ locale }: { locale: Locale }) {
  const t = getMessages().sesPayback;
  const path = localizePath(routes.calculators.sesPayback, locale);
  const url = absoluteUrl(path);
  // The same defaults as the client form: the worked example in «How we calculate».
  const example = calculateSes({
    objectType: sesCalculatorConfig.defaults.objectType,
    goal: sesCalculatorConfig.defaults.goal,
    monthlyKwh: sesCalculatorConfig.consumption.default,
    tariff: householdTariff.value,
    regionId: sesCalculatorConfig.defaults.regionId,
    placement: sesCalculatorConfig.defaults.placement,
    backupLoads: [...defaultApplianceIds],
    backupHours: sesCalculatorConfig.backupHours.default,
  });

  const applicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#application`,
    name: t.title,
    headline: t.meta.title,
    description: t.meta.description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "UAH" },
    featureList: [...t.formulaTitles, t.chartTitle, t.plansTitle],
    provider: { "@id": "https://init.energy/#organization" },
    areaServed: { "@type": "Country", name: serviceArea[locale] },
    inLanguage: locale,
    dateModified: "2026-11-11",
  };

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.home, url: absoluteUrl(localizePath(routes.home, locale)) },
          { name: t.crumb, url },
        ])}
      />
      <JsonLd data={applicationData} />
      <main className="pb-section-sm lg:pb-section">
        <SesPaybackProvider>
          <SesPaybackHero />
          {/*
            Pulled up into the tall bottom of the hero panel (mock-up): the
            overlap is 80 / 224 px, the hero keeps 48 / 64 px of its own
            space below the facts.
          */}
          <section
            id={anchors.calculator}
            aria-labelledby="ses-calculator-form-title"
            className="relative z-10 -mt-20 scroll-mt-28 lg:-mt-56"
          >
            <h2 id="ses-calculator-form-title" className="sr-only">
              {t.calcTitle}
            </h2>
            <Container className="flex flex-col gap-4">
              <SesPaybackCalculator />
              <p className="text-sm text-ink/70">
                {format(t.updatedLine, { count: String(insolationRegions.length) })} ·{" "}
                <a
                  href={`#${anchors.sesMethod}`}
                  className="underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {t.methodLink}
                </a>
              </p>
            </Container>
          </section>
          <SesPaybackYield />
        </SesPaybackProvider>
        <SesPaybackMethod example={example} />
        <SesPaybackPlans />
        <FaqSection page="calculator" title={t.faqTitle} lead={t.faqLead} filter={false} />
        <LeadSection title={t.formTitle} lead={t.formLead} defaultObjectType="house" />
      </main>
    </>
  );
}
