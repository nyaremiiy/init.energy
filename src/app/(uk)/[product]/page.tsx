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
  props: PageProps<"/[product]">,
): Promise<Metadata> {
  const { product } = await props.params;
  return buildProductPageMetadata(product, "uk");
}

export default async function ProductRoute(props: PageProps<"/[product]">) {
  setRequestLocale("uk");
  const { product } = await props.params;
  return <ProductPageView slug={product} locale="uk" />;
}
