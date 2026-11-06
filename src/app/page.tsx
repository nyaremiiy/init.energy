import { Hero } from "@/components/sections/home/hero";
import { ProductLine } from "@/components/sections/home/product-line";
import { SolutionsBySegment } from "@/components/sections/home/solutions-by-segment";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TrustBlock } from "@/components/sections/trust-block";
import { trust } from "@/content/company";
import { anchors, routes } from "@/content/routes";
import { messages } from "@/lib/messages";

export default function Home() {
  const t = messages.trust;

  return (
    // Sections add top spacing only; the page adds the final bottom spacing once.
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
        stats={trust.stats}
        arguments={trust.arguments}
        image={trust.image}
        photoPendingCaption={t.photoPending}
      />
      <ProjectsShowcase />
    </main>
  );
}
