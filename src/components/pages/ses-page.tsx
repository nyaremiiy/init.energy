import { JsonLd } from "@/components/seo/JsonLd";
import { CalculatorSection } from "@/components/sections/home/calculator-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { PageHero } from "@/components/sections/PageHero";
import { getSesHeroSlides } from "@/components/sections/home/hero-slides";
import { ProductLine } from "@/components/sections/home/product-line";
import { LeadSection } from "@/components/sections/LeadSection";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TrustSection } from "@/components/sections/trust-section";
import { SesHybrid } from "@/components/sections/ses/ses-how-hybrid";
import { SesPlantTypes } from "@/components/sections/ses/ses-plant-types";
import { SesSegments } from "@/components/sections/ses/ses-segments";
import { SesSteps } from "@/components/sections/ses/ses-steps";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { absoluteUrl } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schema";

/**
 * Solar power plants hub (/ses/ and /en/ses/). Sections marked as shared are
 * the same components as on the home page.
 */
export function SesPage() {
  const locale = getLocale();
  const t = getMessages();
  const pageUrl = absoluteUrl(localizePath(routes.services.turnkeySes, locale));

  return (
    <>
      <JsonLd
        data={serviceSchema(locale, {
          name: t.ses.meta.title,
          description: t.ses.meta.description,
          url: pageUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          {
            name: t.ses.home,
            url: absoluteUrl(localizePath(routes.home, locale)),
          },
          { name: t.ses.meta.title, url: pageUrl },
        ])}
      />
      <main className="pb-section-sm lg:pb-section">
        <PageHero slides={getSesHeroSlides(locale)} />
        <SesSegments />
        <SesPlantTypes />
        <SesHybrid />
        <TrustSection />
        <SesSteps />
        {/* TODO(content): «Корисне перед покупкою СЕС» — render only when at least 3 articles exist in content/articles/. */}
        <ProductLine />
        <ProjectsShowcase />
        <CalculatorSection />
        <FaqSection page="solar" initialTopic="solar" />
        <LeadSection />
      </main>
    </>
  );
}
