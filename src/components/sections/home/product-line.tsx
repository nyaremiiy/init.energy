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
import { anchors, routes, toAnchor } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";
/** Product in focus on first render (SSR). */
const defaultProduct: ProductId = "svitHome";

/** Server section: header, focused-product tabs (client) and the comparison table. */
export function ProductLine() {
  const messages = getMessages();
  const locale = getLocale();
  const t = messages.productLine;

  const focusProducts: FocusProduct[] = productList.map((product) => ({
    id: product.id,
    name: product.name,
    href: product.href,
    segment: product.segment[locale],
    segmentIcon: product.segmentIcon,
    description: product.focusDescription[locale],
    specs: product.specs.slice(0, 3).map((spec) => ({
      label: messages.specs[spec.key],
      value:
        typeof spec.value === "string"
          ? spec.value
          : formatQuantity(spec.value, locale),
    })),
    image: product.image
      ? { ...product.image, alt: product.image.alt[locale] }
      : undefined,
    detailsLabel: format(t.details, { name: product.name }),
    specsLabel: format(t.specsLabel, { name: product.name }),
    photoPending: `${product.name} — ${t.photoPending}`,
  }));

  return (
    <section
      id={anchors.products}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Panel variant="dark" panelClassName="bg-ink-glow">
        <SectionWatermark text="STORAGE" side="right" tone="dark" />
        <Container
          inPanel
          className="relative flex flex-col gap-section-head-sm lg:gap-section-head py-panel-y-sm lg:py-panel-y"
        >
          <Reveal>
            <SectionHeader
              tone="dark"
              eyebrow={t.eyebrow}
              title={t.title}
              titleId={titleId}
              lead={t.lead}
              aside={
                <ArrowLink href={routes.catalog} tone="dark">
                  {t.catalogLink}
                </ArrowLink>
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
            compareHref={toAnchor(anchors.compare)}
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
