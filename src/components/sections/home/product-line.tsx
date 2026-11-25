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
import { CompareFilter } from "@/components/products/compare-filter";
import { ProductCompareTable, type CompareRow } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { partnerBrands } from "@/content/partner-brands";
import { loadSetById, loadSetHours, loadSetPowerW, outageExample } from "@/content/backup";
import { productList, products, type Product, type ProductId } from "@/content/products";
import { segmentIcons } from "@/content/segments";
import { usableShare } from "@/content/storage";
import { anchors, routes, sectionHref } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { lineupRange, logPosition, specQuantity, toKwh } from "@/lib/capacity-scale";
import { formatNumber, formatQuantity } from "@/lib/format";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";
const compareTableId = "product-compare-table";
/** Product in focus on first render (SSR). */
const defaultProduct: ProductId = "svitHome";

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

/** One row of the comparison table, every figure from products.ts, storage.ts and the runtime calculation. */
function compareRow(product: Product, locale: Locale): CompareRow {
  const t = getMessages().productLine;
  const range = lineupRange();
  const q = (value: number, unit: "kWh" | "W" | "kW") => formatQuantity({ value, unit }, locale);
  const kwh = toKwh(product.capacity);
  const max = specQuantity(product, "maxCapacity");
  const min = specQuantity(product, "minCapacity");

  // Capacity: a range for modules (SVIT PLUS 5000) and BESS blocks (LITHIUMVALLEY), a dot otherwise.
  let capacity: CompareRow["capacity"];
  if (min && max) {
    capacity = {
      value: `${formatNumber(min.value, locale)}–${q(max.value, "kWh")}`,
      scale: { from: logPosition(toKwh(min), range), to: logPosition(toKwh(max), range) },
      note: format(t.blocks, { count: formatNumber(product.maxParallel, locale), value: formatNumber(min.value, locale) }),
    };
  } else if (product.maxParallel > 1) {
    const total = Math.round(kwh * product.maxParallel * 10) / 10;
    capacity = {
      value: formatQuantity(product.capacity, locale),
      scale: { from: logPosition(kwh, range), to: logPosition(total, range) },
      note: format(t.modules, { count: formatNumber(product.maxParallel, locale), total: q(total, "kWh") }),
    };
  } else {
    capacity = { value: formatQuantity(product.capacity, locale), scale: { from: logPosition(kwh, range) } };
  }

  // Power: the spec (power / inverter) or the BESS text; batteries with a separate inverter get the shared caption.
  const powerSpec = specQuantity(product, "power") ?? specQuantity(product, "inverter");
  const separate = product.inverter === "separate";
  const power = {
    value: product.compare.powerText?.[locale] ?? (powerSpec ? formatQuantity(powerSpec, locale) : t.notStated),
    note: separate ? t.separateInverter : product.compare.powerNote?.[locale],
  };

  const cycles = specQuantity(product, "cycles");
  const set = loadSetById(outageExample.loadSet);
  const hours = loadSetHours(set.id, product.id);
  const house =
    product.brand === "LITHIUMVALLEY"
      ? { value: t.byLoad, muted: true }
      : hours === null
        ? { value: set.overload[locale], muted: true }
        : { value: format(t.hours, { hours: formatNumber(hours, locale) }), note: separate ? t.withInverter : undefined };

  return {
    id: product.id,
    name: product.name,
    href: localizePath(product.href, locale),
    linkLabel: format(t.productLink, { name: product.name }),
    type: product.type[locale],
    install: product.compare.install[locale],
    fits: product.compare.fits.map((fit) => ({ id: fit, label: t.fits[fit], icon: segmentIcons[fit] })),
    capacity,
    power,
    cycles: cycles ? formatQuantity(cycles, locale) : t.notStated,
    house,
  };
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
  const houseLoad = formatQuantity({ value: loadSetPowerW(loadSetById(outageExample.loadSet)), unit: "W" }, locale);

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
      scalePosition: logPosition(toKwh(product.capacity), range),
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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="flex max-w-2xl flex-col gap-2">
              <Heading as="h3" id={compareTitleId} size="h3" className="text-ink">
                {t.compareTitle}
              </Heading>
              <p className="text-body text-muted">{format(t.compareLead, { load: houseLoad })}</p>
            </div>
            <CompareFilter
              tableId={compareTableId}
              label={t.filter.label}
              options={(["all", "apartment", "house", "business"] as const).map((id) => ({ id, label: t.filter[id] }))}
            />
          </div>
          <ProductCompareTable
            id={compareTableId}
            caption={t.compareCaption}
            columns={{ ...t.columns, house: format(t.columns.house, { load: houseLoad }) }}
            moreLabel={t.more}
            rows={productList.map((product) => compareRow(product, locale))}
          />
          <div className="flex flex-col items-start gap-3">
            <p className="text-small text-muted">
              {format(t.compareFootnote, { min: kwh(range.min), max: kwh(range.max), share: `${formatNumber(usableShare * 100, locale)}%` })}
            </p>
            <ArrowLink href={`${localizePath(routes.calculators.sesPayback, locale)}#${anchors.calculator}`}>{t.calcLink}</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
