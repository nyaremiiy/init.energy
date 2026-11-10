import { Factory, FlaskConical, House, Store } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { SegmentCard } from "@/components/ui/segment-card";
import type { ApplicationIcon, ProductPage } from "@/content/product-pages";
import { anchors } from "@/content/routes";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const icons: Record<ApplicationIcon, typeof House> = {
  house: House,
  store: Store,
  factory: Factory,
  lab: FlaskConical,
};

/** Card tones match the solution cards on the home page. */
const tones = { sky: "light", navy: "navy", dark: "dark" } as const;

const titleId = "product-applications-title";

export function ProductApplications({
  page,
  name,
  locale,
}: {
  page: ProductPage;
  name: string;
  locale: Locale;
}) {
  const messages = getMessages();
  const t = messages.productPage.applications;

  return (
    <section
      id={anchors.applications}
      aria-labelledby={titleId}
      className="relative scroll-mt-40 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="USE" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={format(t.title, { name })}
            titleId={titleId}
            lead={page.applications.lead[locale]}
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {page.applications.items.map((item, index) => (
            <Reveal
              key={item.title[locale]}
              delay={index * 0.12}
              className="h-full"
            >
              <SegmentCard
                segment={item.tag[locale]}
                segmentIcon={icons[item.icon]}
                title={item.title[locale]}
                description={item.text[locale]}
                links={item.links.map((link) => ({
                  label: link.label[locale],
                  href: link.href,
                }))}
                navLabel={format(t.navLabel, { segment: item.tag[locale] })}
                tone={tones[item.tone]}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
