import {
  BatteryCharging,
  Cable,
  CircleDot,
  Fuel,
  Laptop,
  PlugZap,
  Refrigerator,
  Router,
  Sun,
  Usb,
} from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { ProductPage } from "@/content/product-pages";
import type { Product } from "@/content/products";
import { anchors } from "@/content/routes";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";

const outputIcons = {
  socket: PlugZap,
  usb: Usb,
  typeC: Cable,
  dc: CircleDot,
};

const chargingIcons = {
  grid: BatteryCharging,
  solar: Sun,
  generator: Fuel,
};

const runtimeIcons = {
  laptop: Laptop,
  router: Router,
  fridge: Refrigerator,
};

export function ProductPorts({ page, product, locale }: { page: ProductPage; product: Product; locale: Locale }) {
  const data = page.portable;
  if (!data) return null;

  return (
    <Panel as="section" variant="dark" id={anchors.ports} aria-labelledby="product-ports-title" className="scroll-mt-40 bg-white pt-section-sm lg:pt-section" panelClassName="bg-ink-glow">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={getMessages().productPage.portable.eyebrow} title={data.title[locale]} titleId="product-ports-title" lead={data.lead[locale]} tone="dark" />
        </Reveal>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3 lg:gap-10">
          <ul className="divide-y divide-white/16 border-y border-white/16">
            {data.outputs.map((output) => {
              const Icon = outputIcons[output.icon];
              return (
                <li key={output.label.en} className="flex items-center gap-4 py-4">
                  <span className="w-14 shrink-0 font-heading text-number-sm font-light text-white">{output.count}</span>
                  <Icon aria-hidden className="size-5 text-white/75" />
                  <span className="flex flex-col gap-1"><span className="font-medium text-white">{output.label[locale]}</span><span className="text-sm text-white/75">{output.note[locale]}</span></span>
                </li>
              );
            })}
          </ul>
          <div className="relative min-h-96 overflow-hidden rounded-3xl bg-white/6">
            {product.image ? <Image src={product.image.src} alt={product.image.alt[locale]} fill unoptimized sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" /> : <MediaPlaceholder tone="dark" caption="" className="h-full min-h-96 rounded-3xl" />}
          </div>
          <div className="flex flex-col gap-6">
            <ul className="divide-y divide-white/16 border-y border-white/16">
              {data.charging.map((item) => {
                const Icon = chargingIcons[item.icon];
                return <li key={item.label.en} className="flex items-center gap-4 py-4"><Icon aria-hidden className="size-6 shrink-0 text-white/75" /><span className="flex flex-col gap-1"><span className="font-medium text-white">{item.label[locale]}</span><span className="text-sm text-white/75">{item.note[locale]}</span></span></li>;
              })}
            </ul>
            <div className="mt-auto border-t border-white/16 pt-6"><p className="font-heading text-number-sm font-light whitespace-nowrap text-white lg:text-number">{data.chargeTime[locale]}</p><p className="mt-2 text-sm text-white/75">{data.chargeTimeLabel[locale]}</p></div>
          </div>
        </div>
      </Container>
    </Panel>
  );
}

export function ProductRuntime({ page, locale }: { page: ProductPage; locale: Locale }) {
  const data = page.runtime;
  if (!data) return null;

  return (
    <Panel as="section" variant="sky" id={anchors.runtime} aria-labelledby="product-runtime-title" className="scroll-mt-40 bg-white pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal><SectionHeader eyebrow={getMessages().productPage.runtime.eyebrow} title={data.title[locale]} titleId="product-runtime-title" lead={data.lead[locale]} /></Reveal>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.items.map((item, index) => {
            const Icon = runtimeIcons[item.icon];
            return <li key={item.device.en}><Reveal delay={index * 0.08} className="h-full"><article className="flex h-full flex-col gap-6 rounded-3xl bg-white p-card-sm shadow-card lg:p-card"><Icon aria-hidden className="size-7 text-ink/70" /><Heading as="h3" size="h3">{item.device[locale]}</Heading><p className="mt-auto font-heading text-number-sm font-light text-ink lg:text-number">{item.value[locale]} <span className="text-base font-medium">{item.unit[locale]}</span></p></article></Reveal></li>;
          })}
        </ul>
        <p className="text-sm text-ink/70">{data.note[locale]}</p>
      </Container>
    </Panel>
  );
}
