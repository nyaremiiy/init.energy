import { ArrowUpRight, FileText } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import type { ProductPage } from "@/content/product-pages";
import type { Product } from "@/content/products";
import { anchors } from "@/content/routes";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { specValueText } from "./spec-value";

const titleId = "product-specs-title";

/** Light panel: photo (sticky on lg) + datasheet link and the full spec list. */
export function ProductSpecs({
  page,
  product,
  locale,
}: {
  page: ProductPage;
  product: Product;
  locale: Locale;
}) {
  const messages = getMessages();
  const t = messages.productPage;

  return (
    <Panel
      as="section"
      variant="light"
      id={anchors.specs}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="SPECS" side="right" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader
            eyebrow={t.specs.eyebrow}
            title={format(t.specs.title, { name: product.name })}
            titleId={titleId}
          />
        </Reveal>
        {page.updatedAt ? <p className="font-mono text-sm text-ink/70">{page.updatedAt[locale]}</p> : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-4 lg:sticky lg:top-40">
              {product.image && !page.mediaPlaceholder ? (
                <div className={`relative overflow-hidden rounded-3xl bg-white ${page.specsMediaAspect === "portrait" ? "aspect-4/5" : "aspect-4/3"}`}>
                  <Image
                    src={product.image.src}
                    alt={product.image.alt[locale]}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <MediaPlaceholder
                  caption={format(t.photoPending, { name: product.name })}
                  className={`${page.specsMediaAspect === "portrait" ? "aspect-4/5" : "aspect-4/3"} w-full rounded-3xl`}
                />
              )}
              {page.datasheetUrl ? (
                <a
                  href={page.datasheetUrl}
                  className="group flex items-center gap-4 rounded-3xl bg-white p-card-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <FileText aria-hidden className="size-6 shrink-0" />
                  <span className="flex flex-1 flex-col">
                    <span className="font-medium">{t.specs.datasheet}</span>
                    <span className="text-sm text-ink/70">
                      {t.specs.datasheetNote}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5" />
                </a>
              ) : null}
            </div>
          </div>

          <div
            aria-label={format(t.specs.tableLabel, { name: product.name })}
            className="lg:col-span-7"
          >
            {process.env.NODE_ENV !== "production" && page.specsDevelopmentNotice ? (
              <p className="mb-6 rounded-2xl bg-surface p-card-sm text-sm text-ink/70">{page.specsDevelopmentNotice[locale]}</p>
            ) : null}
            {page.specGroups ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {page.specGroups.map((group) => (
                  <section key={group.title[locale]} aria-labelledby={`spec-${group.title.en.replaceAll(" ", "-").toLowerCase()}`}>
                    <h3 id={`spec-${group.title.en.replaceAll(" ", "-").toLowerCase()}`} className="mb-4 font-heading text-h3-sm font-semibold text-ink sm:text-h3">
                      {group.title[locale]}
                    </h3>
                    <dl className="divide-y divide-line border-y border-line">
                      {group.rows.map((row) => (
                        <div key={row.label[locale]} className="flex flex-col gap-1 py-4">
                          <dt className="text-sm text-ink/70">{row.label[locale]}</dt>
                          <dd className="text-base font-medium text-ink">{specValueText(row.value, locale)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            ) : (
              <dl className="divide-y divide-line border-y border-line">
                {page.specs.map((row) => (
                  <div key={row.label[locale]} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-2 sm:gap-6">
                    <dt className="text-sm text-ink/70 sm:text-base">{row.label[locale]}</dt>
                    <dd className="text-base font-medium text-ink">{specValueText(row.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Container>
    </Panel>
  );
}
