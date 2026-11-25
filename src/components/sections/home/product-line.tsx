import { Container } from "@/components/layout/container";
import {
  ProductFocusTabs,
  type FocusProduct,
} from "@/components/products/ProductFocusTabs";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";

import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { ProductCompareTable } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { partnerBrands } from "@/content/partner-brands";
import { productList, products, type ProductId } from "@/content/products";
import { anchors, routes, sectionHref } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { formatNumber, formatQuantity, type Quantity } from "@/lib/format";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";
/** Product in focus on first render (SSR). */
const defaultProduct: ProductId = "svitHome";

/** Capacity in kWh, for the line-up scale. */
const toKwh = (quantity: Quantity) =>
  quantity.unit === "Wh" ? quantity.value / 1000 : quantity.value;

/**
 * Scale of the whole line-up (from products.ts): smallest capacity to the
 * largest — including the top LITHIUMVALLEY configuration (maxCapacity).
 */
function lineupRange(): { min: number; max: number } {
  const values = productList.flatMap((product) => [
    toKwh(product.capacity),
    ...product.specs
      .filter(
        (spec) => spec.key === "maxCapacity" && typeof spec.value !== "string",
      )
      .map((spec) => toKwh(spec.value as Quantity)),
  ]);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Logarithmic position 0–1: 0,87 and 1 044 kWh differ by three orders of magnitude. */
function logPosition(value: number, min: number, max: number) {
  return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min));
}

/** «Deye · Victron · Huawei» tab: brands as text (no logos or specs — none in content/), why not only SVIT and two actions. */
function PartnerBrandsPanel({ locale }: { locale: Locale }) {
  const t = getMessages().productLine.brands;

  return (
    <>
      <div className="flex min-w-0 flex-col gap-3 rounded-card bg-ink-glow p-card-sm text-white lg:col-span-5 lg:p-card">
        <Eyebrow tone="dark">{t.cardLabel}</Eyebrow>
        <ul className="flex flex-col gap-3">
          {partnerBrands.map((brand) => (
            <li key={brand.id} className="flex flex-col gap-1 rounded-tile border border-line-dark bg-fill-dark p-4">
              <span className="font-heading text-h3-sm font-semibold">{brand.name}</span>
              <span className="text-small text-muted-dark">{brand.description[locale]}</span>
              <span className="text-caption text-muted-dark">{t.services}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-6 lg:col-span-7">
        <CardLabel tone="light" icon={Sparkles}>
          {t.label}
        </CardLabel>
        <h3 className="font-heading text-h2-sm font-semibold tracking-tight text-ink lg:text-h2-md">{t.title}</h3>
        <p className="text-body leading-relaxed text-muted sm:text-lead">{t.text}</p>
        <ul className="w-full border-t border-line">
          {t.points.map((point) => (
            <li key={point} className="flex items-start gap-3 border-b border-line py-3 text-body text-ink">
              <Check aria-hidden className="mt-1 size-4 shrink-0" strokeWidth={2} />
              {point}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button href={`#${anchors.contacts}`} variant="dark" icon={<ArrowUpRight aria-hidden className="size-4.5" />}>
            {t.primary}
          </Button>
          <Button href={localizePath(`${routes.backup.hub}#${anchors.backupEquipment}`, locale)} variant="outline-light">
            {t.secondary}
          </Button>
        </div>
      </div>
    </>
  );
}

/**
 * Server section «Накопичувачі»: header, focused-product tabs (client) with the
 * partner brands tab, and the comparison table. White background (owner's
 * variant B, 2026-11-25): product cards on `surface`.
 */
export function ProductLine() {
  const messages = getMessages();
  const locale = getLocale();
  const t = messages.productLine;
  const range = lineupRange();
  const kwh = (value: number) => formatQuantity({ value, unit: "kWh" }, locale);

  const focusProducts: FocusProduct[] = productList.map((product) => ({
    id: product.id,
    name: product.name,
    href: product.href,
    segment: product.segment[locale],
    segmentIcon: product.segmentIcon,
    description: product.focusDescription[locale],
    specs: product.focusSpecs.flatMap((key) => {
      const spec = product.specs.find((item) => item.key === key);
      if (!spec) return [];
      return [
        {
          label: messages.specs[spec.key],
          value:
            typeof spec.value === "string"
              ? spec.value
              : formatQuantity(spec.value, locale),
        },
      ];
    }),
    capacityCard: {
      chemistryLabel: product.chemistryLabel[locale],
      value: formatNumber(product.capacity.value, locale),
      unit: messages.units[product.capacity.unit],
      prefix:
        product.capacity.qualifier === "from" ? t.capacityFrom : undefined,
      thumbnail: product.image
        ? { src: product.image.src, alt: product.image.alt[locale] }
        : undefined,
      scalePosition: logPosition(toKwh(product.capacity), range.min, range.max),
      scaleMin: kwh(range.min),
      scaleMax: kwh(range.max),
    },
    detailsLabel: format(t.details, { name: product.name }),
    specsLabel: format(t.specsLabel, { name: product.name }),
  }));

  const brandNames = partnerBrands.map((brand) => brand.name);
  const brandList = `${brandNames.slice(0, -1).join(", ")}${locale === "en" ? " and " : " і "}${brandNames[brandNames.length - 1]}`;

  return (
    <section
      id={anchors.products}
      aria-labelledby={titleId}
      className="relative scroll-mt-24 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
        <SectionWatermark text="STORAGE" side="right" />
        <Container
          className="relative flex flex-col gap-section-head-sm lg:gap-section-head"
        >
          <Reveal>
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              titleId={titleId}
              lead={format(t.lead, {
                small: formatQuantity(products.svit600.capacity, locale),
                // «від» is in the sentence itself.
                big: formatQuantity({ value: products.lithiumvalley.capacity.value, unit: products.lithiumvalley.capacity.unit }, locale),
                brands: brandList,
              })}
              aside={
                <ArrowLink href={routes.catalog}>{t.catalogLink}</ArrowLink>
              }
            />
          </Reveal>

          <Reveal delay={0.08} distance={16}>
            <ProductFocusTabs
              products={focusProducts}
              defaultIndex={Math.max(
                0,
                productList.findIndex(
                  (product) => product.id === defaultProduct,
                ),
              )}
              labels={{
                tablist: t.tablist,
                compare: t.compareAll,
              }}
              compareHref={sectionHref(anchors.compare, locale)}
              extra={{
                id: "partner-brands",
                label: brandNames.join(" · "),
                panel: <PartnerBrandsPanel locale={locale} />,
                strip: { brands: brandNames, title: t.brands.stripTitle, text: t.brands.stripText },
              }}
            />
          </Reveal>
        </Container>

      <Container
        id={anchors.compare}
        className="scroll-mt-24 pt-section-head-sm lg:pt-section-head"
      >
        <Reveal className="flex min-w-0 flex-col gap-6">
          <Heading as="h3" id={compareTitleId} size="h3" className="text-ink">
            {t.compareTitle}
          </Heading>
          <ProductCompareTable
            caption={t.compareCaption}
            columns={t.columns}
            moreLabel={t.more}
            rows={productList.map((product) => ({
              id: product.id,
              name: product.name,
              href: product.href,
              type: product.type[locale],
              capacity: formatQuantity(product.capacity, locale),
              audience: product.audience?.[locale] ?? t.notStated,
              linkLabel: format(t.productLink, { name: product.name }),
            }))}
          />
        </Reveal>
      </Container>
    </section>
  );
}
