/** schema.org builders: structured data from the same content as the visible page. */

export type FaqSchemaItem = { question: string; answer: string };

export function faqPageSchema(items: FaqSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type ProductSchemaInput = {
  name: string;
  description: string;
  url: string;
  image?: string;
  /** Spec rows as label/value pairs, exactly as shown on the page. */
  properties: { name: string; value: string }[];
};

/**
 * Product without `offers` (INIT ENERGY does not publish prices) and without
 * `manufacturer`: own production of SVIT is not confirmed (docs/ai/CONTEXT.md).
 */
export function productSchema(input: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    brand: { "@type": "Brand", name: "SVIT" },
    additionalProperty: input.properties.map((property) => ({
      "@type": "PropertyValue",
      name: property.name,
      value: property.value,
    })),
  };
}
