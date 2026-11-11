import type { Metadata } from "next";

import { FaqSection } from "@/components/sections/home/faq-section";
import { SesPaybackCalculator } from "@/components/calculator/ses-payback-calculator";
import { SesPaybackDataNote, SesPaybackDetails, SesPaybackLead } from "@/components/calculator/ses-payback-details";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { routes } from "@/content/routes";
import { serviceArea } from "@/content/company";
import { defaultApplianceIds, appliances } from "@/content/appliances";
import { getMessagesFor } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/config";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { sesCalculatorProductCount } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { calculateSes, type SesCalculationInput } from "@/lib/calc/ses";
import { insolationRegions } from "@/content/insolation";

type QueryValues = Record<string, string | string[] | undefined>;

export function sesPaybackMetadata(locale: Locale): Metadata {
  const t = getMessagesFor(locale).sesPayback;
  const path = routes.calculators.sesPayback;
  const metadata = buildMetadata({ title: t.meta.title, description: t.meta.description, path, locale, image: { url: "/images/og/ses-calculator.svg", width: 1200, height: 630, alt: t.title } });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        uk: absoluteUrl(path),
        en: absoluteUrl(localizePath(path, "en")),
        "x-default": absoluteUrl(path),
      },
    },
  };
}

function parseQuery(query: QueryValues): Partial<SesCalculationInput> {
  const value = (key: string) => Array.isArray(query[key]) ? query[key]?.[0] : query[key];
  const number = (key: string) => {
    const parsed = Number(value(key));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };
  const object = value("object");
  const goal = value("goal");
  const placement = value("placement");
  const regionId = value("region");
  const loads = value("loads");
  const allowedLoads = new Set(appliances.map((item) => item.id));
  return {
    ...(object === "apartment" || object === "house" || object === "business" ? { objectType: object } : {}),
    ...(goal === "savings" || goal === "backup" || goal === "both" ? { goal } : {}),
    ...(number("kwh") ? { monthlyKwh: number("kwh") } : {}),
    ...(number("bill") ? { monthlyBill: number("bill") } : {}),
    ...(number("tariff") ? { tariff: number("tariff") } : {}),
    ...(insolationRegions.some((region) => region.id === regionId) ? { regionId } : {}),
    ...(placement === "roof-south" || placement === "roof-east-west" || placement === "ground" ? { placement } : {}),
    ...(number("roof") ? { roofAreaM2: number("roof") } : {}),
    ...(number("hours") ? { backupHours: number("hours") } : {}),
    ...(number("budget") ? { budget: number("budget") } : {}),
    ...(loads ? { backupLoads: String(loads).split(",").filter((id) => allowedLoads.has(id)) } : {}),
  };
}

export function SesPaybackPage({ locale, query = {} }: { locale: Locale; query?: QueryValues }) {
  const t = getMessagesFor(locale).sesPayback;
  const path = localizePath(routes.calculators.sesPayback, locale);
  const initial = parseQuery(query);
  const input: SesCalculationInput = {
    objectType: "house",
    goal: "both",
    monthlyKwh: 450,
    tariff: householdTariff.value,
    regionId: "lvivska",
    placement: "roof-south",
    backupLoads: [...defaultApplianceIds],
    backupHours: 8,
    ...initial,
  };
  if (input.monthlyBill) input.monthlyKwh = undefined;
  if (input.objectType === "business" && initial.tariff === undefined) input.tariff = 0;
  const result = calculateSes(input);
  const breadcrumbItems = [
    { name: t.home, href: localizePath(routes.home, locale) },
    { name: t.calculators },
    { name: t.eyebrow },
  ];
  const breadcrumbData = breadcrumbSchema([
    { name: t.home, url: absoluteUrl(localizePath(routes.home, locale)) },
    { name: t.calculators, url: absoluteUrl(path) },
    { name: t.eyebrow, url: absoluteUrl(path) },
  ]);
  const applicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${absoluteUrl(path)}#application`,
    name: t.meta.title,
    description: t.meta.description,
    url: absoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "UAH" },
    provider: { "@id": "https://init.energy/#organization" },
    areaServed: { "@type": "Country", name: serviceArea[locale] },
    inLanguage: locale,
  };

  return <>
    <section aria-labelledby="ses-calculator-title" className="px-panel-sm pt-2 sm:px-panel">
      <div className="overflow-clip rounded-panel-sm bg-ink text-white sm:rounded-panel">
        <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
          <JsonLd data={breadcrumbData} />
          <JsonLd data={applicationData} />
          <Breadcrumbs label={t.breadcrumbLabel} items={breadcrumbItems} tone="dark" />
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-5 lg:col-span-8">
              <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
              <h1 id="ses-calculator-title" className="max-w-4xl font-heading text-hero-sm font-semibold leading-tight tracking-tight text-white sm:text-hero-md lg:text-hero">{t.title}</h1>
              <p className="max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">{t.lead}</p>
              <div className="flex flex-wrap gap-3"><span className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink">{t.tab}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-4">
              {[[t.minuteValue, t.minutes], [`${sesCalculatorProductCount}`, t.models], [t.noRegistration, t.registration], [t.open, t.methodology]].map(([value, label]) => <div key={value} className="flex min-h-24 flex-col justify-between rounded-2xl bg-white/8 p-4"><span className="font-heading text-stat-sm font-semibold text-white">{value}</span><span className="text-sm text-white/70">{label}</span></div>)}
            </div>
          </div>
        </Container>
      </div>
    </section>

    <section aria-label={t.title} className="relative z-10 -mt-panel-y-sm pb-section-sm lg:-mt-panel-y lg:pb-section">
      <Container>
        <SesPaybackCalculator copy={t} initial={initial} />
      </Container>
    </section>

    <Container><SesPaybackDetails locale={locale} copy={t} result={result} /></Container>

    <FaqSection page="calculator" title={t.faqTitle} lead={t.faqLead} filter={false} initialTopic="solar" />
    <SesPaybackLead locale={locale} copy={t} input={input} result={result} />
    <SesPaybackDataNote locale={locale} copy={t} generation={result.generationYear} />
  </>;
}
