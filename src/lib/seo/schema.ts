import { socialLinks } from "@/components/layout/header/header-data";
import { companyContacts, offices } from "@/content/company";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";

import { absoluteUrl, siteUrl } from "./metadata";

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

export function howToSchema(name: string, description: string, steps: { name: string; text: string }[]) {
  return { "@context": "https://schema.org", "@type": "HowTo", name, description, step: steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.name, text: step.text })) };
}

type ProductSchemaInput = {
  name: string;
  description: string;
  url: string;
  /** Product type as shown on the page, e.g. «Акумуляторна батарея LiFePO₄». */
  category?: string;
  image?: string;
  /** Spec rows as label/value pairs, exactly as shown on the page. */
  properties: { name: string; value: string }[];
  related?: { name: string; url: string }[];
  parts?: { name: string; url: string }[];
  brand?: string;
  provider?: boolean;
};

/** Product without `offers`: INIT ENERGY does not publish prices. */
export function productSchema(input: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${input.url}#product`,
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.category ? { category: input.category } : {}),
    ...(input.image ? { image: input.image } : {}),
    brand: { "@type": "Brand", name: input.brand ?? "SVIT" },
    ...(input.provider ? { seller: { "@id": `${siteUrl}/#organization` }, provider: { "@id": `${siteUrl}/#organization` } } : {}),
    additionalProperty: input.properties.map((property) => ({
      "@type": "PropertyValue",
      name: property.name,
      value: property.value,
    })),
    ...(input.related?.length
      ? {
          isRelatedTo: input.related.map((product) => ({
            "@type": "Product",
            name: product.name,
            url: product.url,
          })),
        }
      : {}),
    ...(input.parts?.length
      ? {
          hasPart: input.parts.map((product) => ({
            "@type": "Product",
            name: product.name,
            url: product.url,
          })),
        }
      : {}),
  };
}

/**
 * The company for GEO and the Knowledge Graph: name, contacts, both offices,
 * service area and social profiles — from content/company.ts and header data.
 */
export function organizationSchema(locale: Locale) {
  const t = getMessagesFor(locale).meta;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: t.siteName,
    url: absoluteUrl(localizePath("/", locale)),
    logo: absoluteUrl("/images/main-logo.svg"),
    description: t.organizationDescription,
    email: companyContacts.email.display,
    telephone: offices[0].phone.display,
    areaServed: {
      "@type": "Country",
      name: locale === "uk" ? "Україна" : "Ukraine",
    },
    address: offices.map((office) => ({
      "@type": "PostalAddress",
      streetAddress: office.address[locale],
      addressLocality: office.city[locale],
      addressCountry: "UA",
    })),
    contactPoint: offices.map((office) => ({
      "@type": "ContactPoint",
      telephone: office.phone.display,
      contactType: "customer service",
      areaServed: "UA",
      availableLanguage: ["uk", "en"],
    })),
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: getMessagesFor(locale).meta.siteName,
    url: absoluteUrl(localizePath("/", locale)),
    inLanguage: locale,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}
