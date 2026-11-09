import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductAdvantages } from "@/components/product-page/product-advantages";
import { ProductApplications } from "@/components/product-page/product-applications";
import { ProductHero } from "@/components/product-page/product-hero";
import { ProductScaling } from "@/components/product-page/product-scaling";
import { ProductSectionNav } from "@/components/product-page/product-section-nav";
import { ProductSpecs } from "@/components/product-page/product-specs";
import { RelatedProducts } from "@/components/product-page/related-products";
import { specValueText } from "@/components/product-page/spec-value";
import { FaqSection } from "@/components/sections/home/faq-section";
import { LeadSection } from "@/components/sections/LeadSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { productPageBySlug, productPages } from "@/content/product-pages";
import { products } from "@/content/products";
import { anchors, routes, toPath } from "@/content/routes";
import { formatQuantity, type Locale } from "@/lib/format";
import { format, messages } from "@/lib/messages";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, productSchema } from "@/lib/seo/schema";

// Ukrainian only for now; EN arrives with i18n routing (/en/<slug>/).
const locale: Locale = "uk";

/** Only products with page content get a root-level page; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return productPages.map((page) => ({ product: page.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[product]">,
): Promise<Metadata> {
  const { product: slug } = await props.params;
  const page = productPageBySlug(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.meta.title[locale],
    description: page.meta.description[locale],
    path: toPath(page.slug),
  });
}

export default async function ProductRoute(props: PageProps<"/[product]">) {
  const { product: slug } = await props.params;
  const page = productPageBySlug(slug);
  if (!page) notFound();

  const t = messages.productPage;
  const product = products[page.id];
  const path = toPath(page.slug);
  const heroId = "product-hero";

  const navItems = [
    { id: anchors.advantages, label: t.nav.advantages },
    { id: anchors.specs, label: t.nav.specs },
    { id: anchors.scaling, label: t.nav.scaling },
    { id: anchors.applications, label: t.nav.applications },
    { id: anchors.faq, label: t.nav.faq },
  ];

  const summary = (
    <div className="mt-6 flex w-full items-center gap-4 rounded-3xl bg-white p-card-sm lg:p-card">
      {product.image ? (
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
          {product.name} · {formatQuantity(product.capacity, locale)}
        </span>
      </p>
    </div>
  );

  return (
    <>
      <JsonLd
        data={productSchema({
          name: product.name,
          description: page.hero.lead[locale],
          url: absoluteUrl(path),
          image: product.image ? absoluteUrl(product.image.src) : undefined,
          properties: page.specs.map((row) => ({
            name: row.label[locale],
            value: specValueText(row.value, locale),
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: t.home, url: absoluteUrl(routes.home) },
          { name: t.catalog, url: absoluteUrl(routes.catalog) },
          { name: product.name, url: absoluteUrl(path) },
        ])}
      />

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
        <ProductSpecs page={page} product={product} locale={locale} />
        <ProductScaling page={page} name={product.name} locale={locale} />
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
        />
      </main>
    </>
  );
}
