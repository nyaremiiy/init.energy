
import { Container } from "@/components/layout/container";
import { RowLink } from "@/components/ui/row-link";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { products, productSummary, type ProductId } from "@/content/products";
import { anchors, sectionHref } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { formatQuantity } from "@/lib/format";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "related-products-title";

/** Rows of other batteries: name, one-line summary, capacity and a round link. */
export function RelatedProducts({ ids, title, links = [] }: { ids: ProductId[]; title?: string; links?: { title: string; summary: string; href: string }[] }) {
  const messages = getMessages();
  const locale = getLocale();
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
            title={title ?? t.title}
            titleId={titleId}
          />
          <ArrowLink href={sectionHref(anchors.compare, locale)}>
            {t.compareAll}
          </ArrowLink>
        </Reveal>
        <ul className="border-b border-line lg:col-span-7">
          {ids.map((id) => {
            const product = products[id];

            return (
              <li key={id} className="border-t border-line">
                <RowLink
                  href={localizePath(product.href, locale)}
                  title={product.name}
                  description={productSummary(id, locale)}
                  meta={formatQuantity(product.capacity, locale)}
                />
              </li>
            );
          })}
          {links.map((item) => (
            <li key={item.href} className="border-t border-line">
              <RowLink href={localizePath(item.href, locale)} title={item.title} description={item.summary} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
