import {
  ArrowUpRight,
  BatteryCharging,
  House,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import type { ProductPage } from "@/content/product-pages";
import type { Product } from "@/content/products";
import { anchors, routes, sectionHref, toPath } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { specValueText } from "./spec-value";

type ProductHeroProps = {
  page: ProductPage;
  product: Product;
  locale: Locale;
};

/** Dark panel under the site header: breadcrumbs, H1, key specs, CTAs, photo. */
export function ProductHero({ page, product, locale }: ProductHeroProps) {
  const messages = getMessages();
  const t = messages.productPage;
  const path = localizePath(toPath(page.slug), locale);
  const secondaryAnchor =
    page.hero.secondaryCta?.anchor === "composition"
      ? anchors.composition
      : anchors.specs;

  return (
    <Panel
      as="section"
      variant="dark"
      aria-labelledby="product-title"
      className="bg-white pt-panel-sm sm:pt-panel"
      panelClassName="bg-ink-glow shadow-soft"
    >
      <Container
        inPanel
        className="grid grid-cols-1 items-center gap-10 pt-28 pb-panel-y-sm lg:grid-cols-12 lg:gap-16 lg:pt-36 lg:pb-panel-y"
      >
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <Breadcrumbs
            tone="dark"
            label={t.breadcrumbsLabel}
            items={[
              { name: t.home, href: localizePath(routes.home, locale) },
              // TODO(content): switch to routes.catalog once /svit/ exists.
              { name: t.catalog, href: sectionHref(anchors.products, locale) },
              { name: product.name, href: path },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <CardLabel
              tone="dark"
              icon={BatteryCharging}
              className="border-white text-white"
            >
              {page.hero.typeLabel[locale]}
            </CardLabel>
            <CardLabel tone="dark" icon={House}>
              {page.hero.segmentLabel[locale]}
            </CardLabel>
          </div>
          <h1
            id="product-title"
            className="font-heading text-hero-sm font-semibold tracking-tight text-white md:text-hero-md lg:text-hero"
          >
            {product.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {page.hero.lead[locale]}
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {page.hero.keySpecs.map((spec) => (
              <div
                key={spec.label[locale]}
                className="flex flex-col-reverse gap-1 border-t border-white/16 pt-4"
              >
                <dt className="text-sm text-white/75">{spec.label[locale]}</dt>
                <dd className="font-heading text-stat-sm font-medium whitespace-nowrap text-white sm:text-stat">
                  {specValueText(spec.value, locale)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3">
            <Button
              href={`${path}#${anchors.contacts}`}
              icon={<ArrowUpRight aria-hidden className="size-4.5" />}
            >
              {t.getOffer}
            </Button>
            <Button href={`${path}#${secondaryAnchor}`} variant="secondary">
              {page.hero.secondaryCta?.label[locale] ?? t.allSpecs}
            </Button>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          {product.image && !page.mediaPlaceholder ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-white/6">
              <Image
                src={product.image.src}
                alt={product.image.alt[locale]}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <MediaPlaceholder
              tone="dark"
              caption={format(t.photoPending, { name: product.name })}
              className="aspect-4/3 w-full rounded-3xl"
            />
          )}

          <div className="absolute right-4 bottom-4 left-4 flex flex-col items-start gap-3 sm:right-auto">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-ink">
              <ShieldCheck aria-hidden className="size-6 shrink-0" />
              <p className="flex flex-col">
                <span className="text-sm text-ink/70">
                  {page.hero.warranty.title[locale]}
                </span>
                <span className="font-heading text-stat-sm font-medium">
                  {page.hero.warranty.value[locale]}
                </span>
                <span className="text-sm text-ink/70">
                  {page.hero.warranty.note[locale]}
                </span>
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {page.hero.tags.map((tag) => (
              <CardLabel key={tag[locale]} tone="dark" className="bg-ink/60">
                {tag[locale]}
              </CardLabel>
            ))}
          </div>
        </div>
      </Container>
    </Panel>
  );
}
