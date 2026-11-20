import { Container } from "@/components/layout/container";
import { CalculatorSection } from "@/components/sections/home/calculator-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { PageHero } from "@/components/sections/PageHero";
import { getHeroSlides } from "@/components/sections/home/hero-slides";
import { ProductLine } from "@/components/sections/home/product-line";
import { SolutionsBySegment } from "@/components/sections/home/solutions-by-segment";
import { RegionLinks } from "@/components/sections/region-links";
import { LeadSection } from "@/components/sections/LeadSection";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TrustSection } from "@/components/sections/trust-section";
import { JsonLd } from "@/components/seo/JsonLd";
import { PromoBanner } from "@/components/ui/promo-banner";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

/** Home page in the request locale (/ and /en/ render the same sections). */
export function HomePage() {
  const locale = getLocale();
  const hub = getMessages().solutionsBySegment.hub;

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={websiteSchema(locale)} />
      {/* Sections add top spacing only; the page adds the final bottom spacing once. */}
      <main className="pb-section-sm lg:pb-section">
        <PageHero slides={getHeroSlides(locale)} />
        <SolutionsBySegment />
        {/* Turnkey solar promo (replaces the old /cec/ strip under the solution cards). */}
        <div className="pt-section-sm lg:pt-section">
          <Container>
            <Reveal>
              <PromoBanner
                tone="dark"
                title={hub.title}
                description={hub.description}
                cta={{ label: hub.cta, href: localizePath(routes.services.turnkeySes, locale) }}
                image={{ src: "/images/home/promo/ses-roof-1920.avif", alt: hub.imageAlt }}
              />
            </Reveal>
          </Container>
        </div>
        <ProductLine />
        <TrustSection />
        <ProjectsShowcase />
        <CalculatorSection />
        <FaqSection />
        <LeadSection />
        <RegionLinks variant="all" />
      </main>
    </>
  );
}
