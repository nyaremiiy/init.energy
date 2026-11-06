import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { ProductCompareTable } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowLink } from "@/components/ui/arrow-link";
import { productList } from "@/content/products";
import { anchors, routes } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { format, messages } from "@/lib/messages";

const titleId = "product-line-title";
const compareTitleId = "product-line-compare-title";

export function ProductLine() {
  const t = messages.productLine;
  const featured = productList.filter((product) => product.featured);

  return (
    <section
      id={anchors.products}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={<ArrowLink href={routes.catalog}>{t.catalogLink}</ArrowLink>}
          />
        </Reveal>

        {/* Mobile/tablet: swipeable scroll-snap row; lg: static 3-column grid. */}
        <ul
          aria-label={t.listLabel}
          className="scrollbar-none -mx-2.5 -my-2 flex snap-x snap-mandatory scroll-px-2.5 gap-4 overflow-x-auto px-2.5 py-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        >
          {featured.map((product, index) => (
            <li
              key={product.id}
              className="w-5/6 shrink-0 snap-start md:w-1/2 lg:w-auto"
            >
              <Reveal delay={index * 0.12} className="h-full">
                <ProductCard
                  name={product.name}
                  href={product.href}
                  segment={product.segment}
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
              </Reveal>
            </li>
          ))}
        </ul>

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
    </section>
  );
}
