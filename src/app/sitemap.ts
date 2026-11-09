import type { MetadataRoute } from "next";

import { productPages } from "@/content/product-pages";
import { routes, toPath } from "@/content/routes";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * Pages that exist in the site structure. TODO(i18n): add `en` alternates
 * once /en/ routes exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string) => {
    const url = absoluteUrl(path);
    return { url, lastModified, alternates: { languages: { uk: url } } };
  };

  return [
    entry(routes.home),
    ...productPages.map((page) => entry(toPath(page.slug))),
  ];
}
