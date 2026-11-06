import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { ProductCompareTable } from "@/components/ui/product-compare-table";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { productList } from "@/content/products";
import { anchors } from "@/content/routes";
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
      className="scroll-mt-24 bg-white pb-16 lg:pb-24"
    >
      <Container className="flex flex-col gap-10 lg:gap-14">
        <Reveal>
          {/* TODO(content): "Усі накопичувачі SVIT" link needs a /svit/ page, which is not in the site structure. */}
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.12} className="h-full">
              <ProductCard
                name={product.name}
                href={product.href}
                segment={product.featured!.segment}
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
                tone={product.featured!.tone}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex min-w-0 flex-col gap-6 lg:mt-4">
          <Heading
            as="h3"
            id={compareTitleId}
            className="text-2xl text-ink sm:text-3xl"
          >
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
