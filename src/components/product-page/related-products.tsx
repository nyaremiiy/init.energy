import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { IconButton } from "@/components/ui/icon-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { products, productSummaries, type ProductId } from "@/content/products";
import { anchors, toAnchor } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { format, messages } from "@/lib/messages";

const titleId = "related-products-title";

/** Rows of other batteries: name, one-line summary, capacity and a round link. */
export function RelatedProducts({ ids }: { ids: ProductId[] }) {
  const t = messages.productPage.related;

  return (
    <section
      aria-labelledby={titleId}
      className="bg-white pt-section-sm lg:pt-section"
    >
      <Container className="grid grid-cols-1 gap-section-head-sm lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-6 lg:col-span-5">
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
          />
          <ArrowLink href={toAnchor(anchors.compare)}>{t.compareAll}</ArrowLink>
        </Reveal>
        <ul className="border-b border-line lg:col-span-7">
          {ids.map((id) => {
            const product = products[id];

            return (
              <li key={id} className="border-t border-line">
                <Link
                  href={product.href}
                  aria-label={format(t.link, { name: product.name })}
                  className="group flex items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-heading text-base font-semibold text-ink">
                      {product.name}
                    </span>
                    <span className="text-sm text-ink/70">
                      {productSummaries[id]}
                    </span>
                  </span>
                  <span className="hidden text-base font-medium whitespace-nowrap text-ink sm:inline">
                    {formatQuantity(product.capacity)}
                  </span>
                  <IconButton decorative variant="outline-light" size="sm" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
