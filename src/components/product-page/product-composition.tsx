import { BatteryCharging, Grid2X2, Sun } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import type {
  CompositionModeIcon,
  ProductPage,
} from "@/content/product-pages";
import { products } from "@/content/products";
import { anchors } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import type { Locale } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "product-composition-title";
const modesTitleId = "product-composition-modes-title";

const modeIcons: Record<CompositionModeIcon, typeof BatteryCharging> = {
  backup: BatteryCharging,
  solar: Sun,
  grid: Grid2X2,
};

/** Reusable kit composition: components, their facts and operating modes. */
export function ProductComposition({
  page,
  locale,
}: {
  page: ProductPage;
  locale: Locale;
}) {
  const composition = page.composition;
  if (!composition) return null;

  const t = getMessages().productPage.composition;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.composition}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="SYSTEM" tone="dark" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow={t.eyebrow}
            title={composition.title[locale]}
            titleId={titleId}
            lead={composition.lead[locale]}
          />
        </Reveal>

        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {composition.items.map((item, index) => {
            const related = item.relatedProduct
              ? products[item.relatedProduct]
              : undefined;

            return (
              <li key={item.title[locale]}>
                <Reveal delay={index * 0.08} className="h-full">
                  <article className="flex h-full flex-col gap-6 rounded-3xl bg-white/8 p-card-sm lg:p-card">
                    {item.image ? (
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-white/6">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt[locale]}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 30vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <MediaPlaceholder
                        tone="dark"
                        caption={format(t.photoPending, {
                          component: item.title[locale],
                        })}
                        className="aspect-16/10 w-full rounded-2xl"
                      />
                    )}
                    <span className="font-mono text-sm text-white/75 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-3">
                      <Heading as="h3" size="h3" className="text-white">
                        {item.title[locale]}
                      </Heading>
                      <p className="text-base leading-relaxed text-white/75">
                        {item.text[locale]}
                      </p>
                    </div>
                    <dl className="mt-auto divide-y divide-white/16 border-y border-white/16">
                      {item.specs.map((spec) => (
                        <div
                          key={spec.label[locale]}
                          className="flex items-baseline justify-between gap-4 py-3"
                        >
                          <dt className="text-sm text-white/75">
                            {spec.label[locale]}
                          </dt>
                          <dd className="text-right text-base font-medium text-white">
                            {spec.value[locale]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {related && item.linkLabel ? (
                      <ArrowLink
                        href={localizePath(related.href, locale)}
                        tone="dark"
                      >
                        {item.linkLabel[locale]}
                      </ArrowLink>
                    ) : null}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-1 gap-8 border-t border-white/16 pt-section-head-sm lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col items-start gap-4 lg:col-span-4">
            <Eyebrow tone="dark">{composition.modesEyebrow[locale]}</Eyebrow>
            <Heading
              as="h2"
              id={modesTitleId}
              size="h2"
              className="text-white"
            >
              {composition.modesTitle[locale]}
            </Heading>
          </Reveal>
          <ul
            aria-labelledby={modesTitleId}
            className="border-b border-white/16 lg:col-span-8"
          >
            {composition.modes.map((mode, index) => {
              const Icon = modeIcons[mode.icon];
              return (
                <li key={mode.title[locale]}>
                  <Reveal delay={index * 0.08} distance={16}>
                    <div className="grid grid-cols-1 gap-3 border-t border-white/16 py-6 sm:grid-cols-12 sm:gap-6">
                      <Icon
                        aria-hidden
                        className="size-5 text-white/75 sm:col-span-1"
                        strokeWidth={1.7}
                      />
                      <Heading
                        as="h3"
                        size="h3"
                        className="text-white sm:col-span-4"
                      >
                        {mode.title[locale]}
                      </Heading>
                      <p className="text-base leading-relaxed text-white/75 sm:col-span-7">
                        {mode.text[locale]}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Panel>
  );
}
