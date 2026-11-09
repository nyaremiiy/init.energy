import type { Metadata } from "next";

/** Production origin: canonical URLs, sitemap and JSON-LD are absolute. */
export const siteUrl = "https://init.energy";

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Site path with the trailing slash, e.g. "/svit-plus-5000/". */
  path: string;
};

/**
 * Page metadata in one shape: title, description, canonical, hreflang and
 * Open Graph.
 *
 * TODO(i18n): add `en` to `languages` once /en/ routes exist — linking
 * hreflang to pages that 404 hurts indexing.
 * TODO(content): Open Graph image 1200×630 per page.
 */
export function buildMetadata({
  title,
  description,
  path,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { uk: url, "x-default": url },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "uk_UA",
      siteName: "INIT ENERGY",
    },
  };
}
