import { BatteryCharging, ChartNoAxesCombined, CircleDollarSign, Fuel, Sun } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { ProductPage } from "@/content/product-pages";
import { anchors } from "@/content/routes";
import { getMessages } from "@/i18n/server";
import type { Locale } from "@/lib/format";

export function ProductConfigurations({ page, locale }: { page: ProductPage; locale: Locale }) {
  const data = page.configurations;
  if (!data) return null;
  const t = getMessages().productPage.configurations;
  return (
    <Panel as="section" variant="dark" id={anchors.configurations} aria-labelledby="configurations-title" className="scroll-mt-40 bg-white pt-section-sm lg:pt-section" panelClassName="bg-ink-glow">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <SectionHeader eyebrow={t.eyebrow} title={data.title[locale]} titleId="configurations-title" lead={data.lead[locale]} tone="dark" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.items.map((item, index) => (
            <Reveal key={item.label.en} delay={index * 0.08}>
              <article className="flex h-full flex-col gap-6 rounded-3xl bg-white/6 p-card-sm text-white lg:p-card">
                <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-sm text-white/75">{item.label[locale]}</p><CardLabel tone="dark">{data.delivery[locale]}</CardLabel></div>
                <dl className="grid grid-cols-2 gap-4">
                  <div><dd className="font-heading text-number-sm font-light whitespace-nowrap lg:text-number">{item.baseKwh}</dd><dt className="text-sm text-white/75">кВт·год</dt></div>
                  <div><dd className="font-heading text-number-sm font-light whitespace-nowrap lg:text-number">{item.inverterKw}</dd><dt className="text-sm text-white/75">кВт SOLIS</dt></div>
                </dl>
                <p className="text-sm text-white/75">{t.scaling}</p>
                <div className="grid grid-cols-4 gap-2">
                  {item.capacities.map((capacity, capacityIndex) => (
                    <div key={capacity} className="flex flex-col items-center gap-2">
                      <div className="flex h-32 w-full flex-col-reverse gap-1" aria-hidden>{Array.from({ length: capacityIndex + 1 }, (_, block) => <span key={block} className="flex-1 rounded-lg bg-white/16" />)}</div>
                      <span className="font-mono text-sm whitespace-nowrap">{capacity}</span>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Panel>
  );
}

const modeIcons = { backup: BatteryCharging, solar: Sun, generator: Fuel, peak: ChartNoAxesCombined, cost: CircleDollarSign };
export function ProductModes({ page, locale }: { page: ProductPage; locale: Locale }) {
  const data = page.modes;
  if (!data) return null;
  const t = getMessages().productPage.modes;
  return <section id={anchors.modes} aria-labelledby="modes-title" className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"><Container className="flex flex-col gap-section-head-sm lg:gap-section-head"><SectionHeader eyebrow={t.eyebrow} title={data.title[locale]} titleId="modes-title" lead={data.lead[locale]} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{data.items.map((item, index) => { const Icon = modeIcons[item.icon]; return <Reveal key={item.title.en} delay={index * 0.06}><article className="flex h-full flex-col gap-5 rounded-3xl bg-surface p-card-sm lg:p-card"><Icon aria-hidden className="size-6" /><Heading as="h3" size="h3">{item.title[locale]}</Heading><p className="mt-auto text-base text-ink/70">{item.text[locale]}</p></article></Reveal>; })}</div></Container></section>;
}

export function HowToSteps({ page, locale }: { page: ProductPage; locale: Locale }) {
  const data = page.process;
  if (!data) return null;
  const t = getMessages().productPage.process;
  return <Panel as="section" variant="sky" id={anchors.process} aria-labelledby="process-title" className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"><Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"><SectionHeader eyebrow={t.eyebrow} title={data.title[locale]} titleId="process-title" lead={data.lead[locale]} /><ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{data.steps.map((step, index) => <li key={step.title.en} className="border-t border-line pt-5"><span className="font-mono text-sm text-ink/70">{String(index + 1).padStart(2, "0")}</span><Heading as="h3" size="h3" className="mt-4">{step.title[locale]}</Heading><p className="mt-2 text-base text-ink/70">{step.text[locale]}</p></li>)}</ol></Container></Panel>;
}
