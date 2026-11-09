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
import { format, messages } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";
/** Product in focus on first render (SSR). */
const defaultProduct: ProductId = "svitHome";

/** Server section: header, focused-product tabs (client) and the comparison table. */
export function ProductLine() {
  const t = messages.productLine;

  const focusProducts: FocusProduct[] = productList.map((product) => ({
    id: product.id,
    name: product.name,
    href: product.href,
    segment: product.segment,
    description: product.focusDescription,
    specs: product.specs.slice(0, 3).map((spec) => ({
      label: messages.specs[spec.key],
      value:
        typeof spec.value === "string"
          ? spec.value
          : formatQuantity(spec.value),
    })),
    image: product.image,
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
        <Container className="relative flex flex-col gap-section-head py-section-sm lg:py-section">
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
        className="scroll-mt-24 pt-section-sm lg:pt-section"
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
              type: product.type,
              capacity: formatQuantity(product.capacity),
              audience: product.audience ?? t.notStated,
              linkLabel: format(t.productLink, { name: product.name }),
            }))}
          />
        </Reveal>
      </Container>
    </section>
  );
}
