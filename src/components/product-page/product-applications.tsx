import { BatteryCharging, BriefcaseBusiness, Factory, House, Luggage, Store, Sun, TentTree, Unplug } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
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
  solar: Sun,
  backup: BatteryCharging,
  hybrid: Unplug,
  travel: Luggage,
  work: BriefcaseBusiness,
  camping: TentTree,
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
            title={page.applications.title?.[locale] ?? format(t.title, { name })}
            titleId={titleId}
            lead={page.applications.lead[locale]}
          />
        </Reveal>
        <div className={`grid grid-cols-1 gap-4 ${page.portable ? "sm:grid-cols-2 lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {page.applications.items.map((item, index) => (
            <Reveal
              key={item.title[locale]}
              delay={index * 0.12}
              className="h-full"
            >
              {page.applications.variant === "sectors" ? (
                <article className={`flex h-full flex-col gap-6 rounded-3xl p-card-sm lg:p-card ${item.tone === "sky" ? "bg-sky text-ink" : item.tone === "navy" ? "bg-navy text-white" : "bg-ink text-white"}`}>
                  <CardLabel tone={item.tone === "sky" ? "light" : "dark"} icon={icons[item.icon]}>{item.tag[locale]}</CardLabel>
                  <Heading as="h3" size="h3">{item.title[locale]}</Heading>
                  <ul className={`divide-y ${item.tone === "sky" ? "divide-line border-line" : "divide-white/16 border-white/16"} border-y`}>
                    {item.sectors?.map((sector) => <li key={sector.en} className="py-3 text-base">{sector[locale]}</li>)}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3">{item.links.map((link) => <ArrowLink key={link.label.en} href={link.href} tone={item.tone === "sky" ? "dark" : "light"}>{link.label[locale]}</ArrowLink>)}</div>
                </article>
              ) : (
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
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
