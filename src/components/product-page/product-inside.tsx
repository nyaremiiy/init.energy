import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { ProductPage } from "@/content/product-pages";
import { anchors } from "@/content/routes";
import { getMessages } from "@/i18n/server";
import type { Locale } from "@/lib/format";

const titleId = "product-inside-title";

/** Reusable battery internals section driven entirely by product content. */
export function ProductInside({ page, locale }: { page: ProductPage; locale: Locale }) {
  const inside = page.inside;
  if (!inside) return null;

  const t = getMessages().productPage.inside;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.inside}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={inside.title[locale]} titleId={titleId} lead={inside.lead[locale]} tone="dark" />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="flex h-full flex-col gap-6 rounded-3xl bg-white/6 p-card-sm text-white lg:p-card">
              <div>
                <Heading as="h3" size="h3">{inside.cellCount} {locale === "uk" ? "комірок" : "cells"} {inside.cellBrand} · {inside.configuration}</Heading>
                <p className="mt-2 font-mono text-sm text-white/75">{inside.cellCapacityAh} {locale === "uk" ? "А·год" : "Ah"} × {inside.cellCount} · {inside.voltage[locale]}</p>
              </div>
              <div aria-label={t.cellsLabel} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {Array.from({ length: inside.cellCount }, (_, index) => (
                  <div key={index} aria-hidden className="flex aspect-square items-center justify-center rounded-2xl border border-white/16 bg-white/6 font-mono text-sm text-white/75">
                    {inside.cellBrand} {String(index + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <dl className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
                {inside.stats.map((stat) => (
                  <div key={stat.label[locale]} className="border-t border-white/16 pt-4">
                    <dd className="font-heading text-stat-sm font-medium whitespace-nowrap sm:text-stat">{stat.value[locale]}</dd>
                    <dt className="mt-1 text-sm text-white/75">{stat.label[locale]}</dt>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="flex h-full flex-col gap-6 rounded-3xl bg-white p-card-sm text-ink lg:p-card">
              <Heading as="h3" size="h3">{inside.bms.title[locale]}</Heading>
              <p className="text-base leading-relaxed text-ink/70">{inside.bms.lead[locale]}</p>
              <ul aria-label={t.protectionsLabel} className="mt-auto divide-y divide-line border-y border-line">
                {inside.bms.protections.map((protection) => (
                  <li key={protection[locale]} className="flex items-center gap-3 py-3 text-base font-medium">
                    <ShieldCheck aria-hidden className="size-5 shrink-0" />
                    {protection[locale]}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="flex flex-col gap-6 rounded-3xl bg-white/6 p-card-sm text-white lg:flex-row lg:items-center lg:justify-between lg:p-card">
            <div>
              <Heading as="h3" size="h3">{inside.compatibility.title[locale]}</Heading>
              <p className="mt-2 text-base text-white/75">{inside.compatibility.lead[locale]}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {inside.compatibility.brands.map((brand) => (
                <li key={brand.en} className="rounded-full border border-white/16 bg-white/6 px-4 py-2 text-sm font-medium">{brand[locale]}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Panel>
  );
}
