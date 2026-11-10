import { Container } from "@/components/layout/container";
import {
  ProductFocusTabs,
  type FocusProduct,
} from "@/components/products/ProductFocusTabs";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { ProductCompareTable } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { productList, type ProductId } from "@/content/products";
import { anchors, routes, sectionHref } from "@/content/routes";
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

/** Server section: header, focused-product tabs (client) and the comparison table. */
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
      cellCount: product.cellCount,
      modules: product.modules,
      scalePosition: logPosition(toKwh(product.capacity), range.min, range.max),
      scaleMin: kwh(range.min),
      scaleMax: kwh(range.max),
    },
    detailsLabel: format(t.details, { name: product.name }),
    specsLabel: format(t.specsLabel, { name: product.name }),
  }));

  return (
    <section
      id={anchors.products}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Panel variant="sky">
        <SectionWatermark text="STORAGE" side="right" />
        <Container
          inPanel
          className="relative flex flex-col gap-section-head-sm lg:gap-section-head py-panel-y-sm lg:py-panel-y"
        >
          <Reveal>
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              titleId={titleId}
              lead={t.lead}
              aside={
                <ArrowLink href={routes.catalog}>{t.catalogLink}</ArrowLink>
              }
            />
          </Reveal>

          <ProductFocusTabs
            products={focusProducts}
            defaultIndex={Math.max(
              0,
              productList.findIndex((product) => product.id === defaultProduct),
            )}
            labels={{
              tablist: t.tablist,
              compare: t.compareAll,
            }}
            compareHref={sectionHref(anchors.compare, locale)}
          />
        </Container>
      </Panel>

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
