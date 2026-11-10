import type { Metadata } from "next";

import {
  buildProductPageMetadata,
  ProductPageView,
} from "@/components/pages/product-page";
import { productPages } from "@/content/product-pages";
import { setRequestLocale } from "@/i18n/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return productPages.map((page) => ({ product: page.slug }));
}

export async function generateMetadata(
  props: PageProps<"/en/[product]">,
): Promise<Metadata> {
  const { product } = await props.params;
  return buildProductPageMetadata(product, "en");
}

export default async function EnglishProductRoute(
  props: PageProps<"/en/[product]">,
) {
  setRequestLocale("en");
  const { product } = await props.params;
  return <ProductPageView slug={product} locale="en" />;
}
