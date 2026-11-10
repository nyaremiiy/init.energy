import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductAdvantages } from "@/components/product-page/product-advantages";
import { ProductApplications } from "@/components/product-page/product-applications";
import { ProductComposition } from "@/components/product-page/product-composition";
import { ProductHero } from "@/components/product-page/product-hero";
import { ProductInside } from "@/components/product-page/product-inside";
import { ProductScaling } from "@/components/product-page/product-scaling";
import { ProductSectionNav } from "@/components/product-page/product-section-nav";
import { ProductSpecs } from "@/components/product-page/product-specs";
import { RelatedProducts } from "@/components/product-page/related-products";
import { specValueText } from "@/components/product-page/spec-value";
import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { productPageBySlug } from "@/content/product-pages";
import { products } from "@/content/products";
import { anchors, routes, sectionHref, toPath } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatQuantity, type Locale } from "@/lib/format";
import { format } from "@/lib/messages";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  organizationSchema,
  productSchema,
} from "@/lib/seo/schema";

export function buildProductPageMetadata(
  slug: string,
  locale: Locale,
): Metadata {
  const page = productPageBySlug(slug);
  if (!page) return {};
  const product = products[page.id];

  return buildMetadata({
    title: page.meta.title[locale],
    description: page.meta.description[locale],
    path: toPath(page.slug),
    locale,
    image:
      page.ogImage && product?.image
        ? {
            url: page.ogImage,
            width: 1200,
            height: 630,
            alt: product.image.alt[locale],
          }
        : undefined,
  });
}

/** Shared server-rendered product page for root Ukrainian and /en/ routes. */
export function ProductPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const page = productPageBySlug(slug);
  if (!page) notFound();

  const t = getMessages().productPage;
  const product = products[page.id];
  const path = localizePath(toPath(page.slug), locale);
  const heroId = "product-hero";
  const variableSection = page.inside
    ? { id: anchors.inside, label: t.nav.inside }
    : page.composition
    ? { id: anchors.composition, label: t.nav.composition }
    : { id: anchors.scaling, label: t.nav.scaling };
  const navItems = page.composition || page.inside
    ? [
        { id: anchors.advantages, label: t.nav.advantages },
        variableSection,
        { id: anchors.specs, label: t.nav.specs },
        { id: anchors.applications, label: t.nav.applications },
        { id: anchors.faq, label: t.nav.faq },
      ]
    : [
        { id: anchors.advantages, label: t.nav.advantages },
        { id: anchors.specs, label: t.nav.specs },
        variableSection,
        { id: anchors.applications, label: t.nav.applications },
        { id: anchors.faq, label: t.nav.faq },
      ];
  const summaryText =
    page.consultation.summary?.[locale] ??
    `${product.name} · ${formatQuantity(product.capacity, locale)}`;
  const summary = (
    <div className="mt-6 flex w-full items-center gap-4 rounded-3xl bg-white p-card-sm lg:p-card">
      {product.image && !page.mediaPlaceholder ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
          <Image
            src={product.image.src}
            alt=""
            fill
            unoptimized
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        <MediaPlaceholder caption="" className="size-16 shrink-0 rounded-2xl" />
      )}
      <p className="flex flex-col gap-1">
        <span className="text-sm text-ink/70">
          {t.consultation.summaryTitle}
        </span>
        <span className="font-heading text-base font-semibold text-ink">
          {summaryText}
        </span>
      </p>
    </div>
  );
  const compositionParts = page.composition?.items.flatMap((item) =>
    item.relatedProduct ? [products[item.relatedProduct]] : [],
  );
  const relatedProducts = page.related.map((id) => products[id]);

  return (
    <>
      <JsonLd
        data={productSchema({
          name: product.name,
          description: page.hero.lead[locale],
          category: page.hero.typeLabel[locale],
          url: absoluteUrl(path),
          image:
            product.image && !page.mediaPlaceholder
              ? absoluteUrl(product.image.src)
              : undefined,
          properties: (page.specGroups?.flatMap((group) => group.rows) ?? page.specs).map((row) => ({
            name: row.label[locale],
            value: specValueText(row.value, locale),
          })),
          related: relatedProducts.map((related) => ({
            name: related.name,
            url: absoluteUrl(localizePath(related.href, locale)),
          })),
          parts: compositionParts?.map((related) => ({
            name: related.name,
            url: absoluteUrl(localizePath(related.href, locale)),
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          {
            name: t.home,
            url: absoluteUrl(localizePath(routes.home, locale)),
          },
          {
            name: t.catalog,
            url: absoluteUrl(sectionHref(anchors.products, locale)),
          },
          { name: product.name, url: absoluteUrl(path) },
        ])}
      />
      <JsonLd data={organizationSchema(locale)} />

      <main className="pb-section-sm lg:pb-section">
        <div id={heroId}>
          <ProductHero page={page} product={product} locale={locale} />
        </div>
        <ProductSectionNav
          label={t.navLabel}
          items={navItems}
          productName={product.name}
          cta={{ href: `${path}#${anchors.contacts}`, label: t.getOffer }}
          heroId={heroId}
        />
        <ProductAdvantages page={page} name={product.name} locale={locale} />
        {page.composition ? (
          <ProductComposition page={page} locale={locale} />
        ) : null}
        {page.inside ? <ProductInside page={page} locale={locale} /> : null}
        <ProductSpecs page={page} product={product} locale={locale} />
        {page.scaling ? (
          <ProductScaling page={page} name={product.name} locale={locale} />
        ) : null}
        <ProductApplications page={page} name={product.name} locale={locale} />
        <FaqSection
          page={page.slug}
          title={format(t.faq.title, { name: product.name })}
          lead={t.faq.lead}
          filter={false}
        />
        <RelatedProducts ids={page.related} />
        <LeadSection
          panel
          title={t.consultation.title}
          lead={page.consultation.lead[locale]}
          summary={summary}
          product={page.slug}
          submitLabel={t.consultation.submit}
          commentPlaceholder={page.consultation.commentPlaceholder?.[locale]}
        />
      </main>
    </>
  );
}
