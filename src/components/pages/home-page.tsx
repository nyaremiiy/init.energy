import { CalculatorSection } from "@/components/sections/home/calculator-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { Hero } from "@/components/sections/home/hero";
import { ProductLine } from "@/components/sections/home/product-line";
import { SolutionsBySegment } from "@/components/sections/home/solutions-by-segment";
import { LeadSection } from "@/components/sections/LeadSection";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TrustBlock } from "@/components/sections/trust-block";
import { JsonLd } from "@/components/seo/JsonLd";
import { trust } from "@/content/company";
import { anchors, routes } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

/** Home page in the request locale (/ and /en/ render the same sections). */
export function HomePage() {
  const locale = getLocale();
  const messages = getMessages();
  const t = messages.trust;

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={websiteSchema(locale)} />
      {/* Sections add top spacing only; the page adds the final bottom spacing once. */}
      <main className="pb-section-sm lg:pb-section">
        <Hero />
        <SolutionsBySegment />
        <ProductLine />
        <TrustBlock
          id={anchors.aboutUs}
          titleId="trust-title"
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.lead}
          link={{ href: routes.about, label: t.aboutLink }}
          stats={trust.stats.map((stat) => ({
            id: stat.id,
            value: stat.value[locale],
            label: stat.label[locale],
          }))}
          arguments={trust.arguments.map((argument) => ({
            id: argument.id,
            title: argument.title[locale],
            description: argument.description[locale],
          }))}
          image={
            trust.image
              ? { ...trust.image, alt: trust.image.alt[locale] }
              : undefined
          }
          photoPendingCaption={t.photoPending}
        />
        <ProjectsShowcase />
        <CalculatorSection />
        <FaqSection />
        <LeadSection />
      </main>
    </>
  );
}
