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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-4 lg:sticky lg:top-40">
              {product.image ? (
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-white">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt[locale]}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <MediaPlaceholder
                  caption={format(t.photoPending, { name: product.name })}
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

          <dl
            aria-label={format(t.specs.tableLabel, { name: product.name })}
            className="divide-y divide-line border-y border-line lg:col-span-7"
          >
            {page.specs.map((row) => (
              <div
                key={row.label[locale]}
                className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-2 sm:gap-6"
              >
                <dt className="text-sm text-ink/70 sm:text-base">
                  {row.label[locale]}
                </dt>
                <dd className="text-base font-medium text-ink">
                  {specValueText(row.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Panel>
  );
}
