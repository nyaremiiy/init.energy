import { socialLinks } from "@/components/layout/header/header-data";
import { companyContacts, offices, serviceArea } from "@/content/company";
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
      name: serviceArea[locale],
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

/**
 * The plant service: provider is the organization, area is the country
 * unless `areaServed` names a region (region pages: AdministrativeArea / City).
 */
type ServiceArea = { type: "AdministrativeArea" | "City"; name: string };

export function serviceSchema(
  locale: Locale,
  input: {
    name: string;
    description: string;
    url: string;
    serviceType?: string;
    /** One area, or several (a region and its centre on backup region pages). */
    areaServed?: ServiceArea | ServiceArea[];
  },
) {
  const place = (area: ServiceArea) => ({
    "@type": area.type,
    name: area.name,
    containedInPlace: { "@type": "Country", name: serviceArea[locale] },
  });
  const areas = input.areaServed === undefined ? undefined : Array.isArray(input.areaServed) ? input.areaServed : [input.areaServed];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.serviceType ?? input.name,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: areas ? (areas.length === 1 ? place(areas[0]) : areas.map(place)) : { "@type": "Country", name: serviceArea[locale] },
  };
}

/**
 * The page around a Service with its revision date: schema.org has no `dateModified` on Service
 * (it belongs to CreativeWork), so backup pages state it on the WebPage whose main entity is the service.
 */
export function servicePageSchema(locale: Locale, input: { name: string; url: string; dateModified: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    inLanguage: locale,
    dateModified: input.dateModified,
    mainEntity: { "@id": `${input.url}#service` },
  };
}
