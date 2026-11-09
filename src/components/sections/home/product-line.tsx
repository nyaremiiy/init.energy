import { segmentIcons } from "@/content/segments";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { ProductCard } from "@/components/ui/product-card";
import { ProductCompareTable } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { ScrollSlider } from "@/components/ui/scroll-slider";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { ArrowLink } from "@/components/ui/arrow-link";
import { productList } from "@/content/products";
import { anchors, routes } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { format, messages } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";

export function ProductLine() {
  const t = messages.productLine;

  return (
    <Panel
      as="section"
      variant="sky"
      id={anchors.products}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="STORAGE" side="right" />
      <Container className="relative flex flex-col gap-section-head py-section-sm lg:py-section">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={<ArrowLink href={routes.catalog}>{t.catalogLink}</ArrowLink>}
          />
        </Reveal>

        {/* All products: swipe on touch screens, arrow buttons from lg. */}
        <Reveal>
          <ScrollSlider
            label={t.listLabel}
            previousLabel={t.previous}
            nextLabel={t.next}
          >
            {productList.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                href={product.href}
                segment={product.segment}
                segmentIcon={segmentIcons[product.segmentIcon]}
                description={product.description}
                specs={product.specs.map((spec) => ({
                  label: messages.specs[spec.key],
                  value:
                    typeof spec.value === "string"
                      ? spec.value
                      : formatQuantity(spec.value),
                }))}
                image={product.image}
                linkLabel={format(t.productLink, { name: product.name })}
                specsLabel={format(t.specsLabel, { name: product.name })}
                photoPendingCaption={`${product.name} — ${t.photoPending}`}
              />
            ))}
          </ScrollSlider>
        </Reveal>

        <Reveal className="mt-4 flex min-w-0 flex-col gap-6">
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
    </Panel>
  );
}
