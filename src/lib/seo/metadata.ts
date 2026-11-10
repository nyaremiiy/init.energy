import type { Metadata } from "next";

import {
  defaultLocale,
  hasEnglish,
  localizePath,
  ogLocale,
  type Locale,
} from "@/i18n/config";

/** Production origin: canonical URLs, sitemap and JSON-LD are absolute. */
export const siteUrl = "https://init.energy";

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

/**
 * hreflang for a page: Ukrainian at the root, English under /en/ when the
 * page has an English version. x-default points to Ukrainian, so anyone
 * whose language is neither gets the main (Ukrainian) site; English-language
 * searches get /en/.
 */
export function languageAlternates(path: string): Record<string, string> {
  const uk = absoluteUrl(path);
  return hasEnglish(path)
    ? { uk, en: absoluteUrl(localizePath(path, "en")), "x-default": uk }
    : { uk, "x-default": uk };
}

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Ukrainian path with the trailing slash, e.g. "/svit-plus-5000/". */
  path: string;
  locale?: Locale;
  /** Share image (site-relative URL). */
  image?: { url: string; width: number; height: number; alt: string };
};

/**
 * Page metadata in one shape: title, description, canonical (self-referencing
 * per locale), hreflang and Open Graph.
 *
 * TODO(content): Open Graph image 1200×630 per page.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
  image,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(localizePath(path, locale));
  const alternateLocale = hasEnglish(path)
    ? [ogLocale[locale === "uk" ? "en" : "uk"]]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: ogLocale[locale],
      alternateLocale,
      siteName: "INIT ENERGY",
      ...(image ? { images: [{ ...image, url: absoluteUrl(image.url) }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [absoluteUrl(image.url)] } : {}),
    },
  };
}
