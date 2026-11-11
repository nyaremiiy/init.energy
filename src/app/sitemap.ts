import type { MetadataRoute } from "next";

import { localizedPaths, localizePath } from "@/i18n/config";
import { productPages } from "@/content/product-pages";
import { routes, toPath } from "@/content/routes";
import { absoluteUrl, languageAlternates } from "@/lib/seo/metadata";

/**
 * Pages that exist in the site structure, each with its hreflang alternates;
 * English versions are listed as their own URLs too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string, url: string) => ({
    url,
    lastModified,
    alternates: { languages: languageAlternates(path) },
  });

  const ukPaths = [
    routes.home,
    routes.services.turnkeySes,
    routes.calculators.sesPayback,
    routes.sesNiche.hotel,
    ...productPages.map((page) => toPath(page.slug)),
  ];

  return [
    ...ukPaths.map((path) => entry(path, absoluteUrl(path))),
    ...localizedPaths.map((path) =>
      entry(path, absoluteUrl(localizePath(path, "en"))),
    ),
  ];
}
