import { CalculatorSection } from "@/components/sections/home/calculator-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { Hero } from "@/components/sections/home/hero";
import { ProductLine } from "@/components/sections/home/product-line";
import { SolutionsBySegment } from "@/components/sections/home/solutions-by-segment";
import { LeadSection } from "@/components/sections/LeadSection";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TrustSection } from "@/components/sections/trust-section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocale } from "@/i18n/server";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

/** Home page in the request locale (/ and /en/ render the same sections). */
export function HomePage() {
  const locale = getLocale();

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={websiteSchema(locale)} />
      {/* Sections add top spacing only; the page adds the final bottom spacing once. */}
      <main className="pb-section-sm lg:pb-section">
        <Hero />
        <SolutionsBySegment />
        <ProductLine />
        <TrustSection />
        <ProjectsShowcase />
        <CalculatorSection />
        <FaqSection />
        <LeadSection />
      </main>
    </>
  );
}
