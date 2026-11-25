import type { MetadataRoute } from "next";

import { localizedPaths, localizePath } from "@/i18n/config";
import { updatedAt as backupUpdatedAt } from "@/content/backup";
import { backupRegionPaths, regionPaths, updatedAt as insolationUpdatedAt } from "@/content/insolation";
import { productPages } from "@/content/product-pages";
import { routes, toPath } from "@/content/routes";
import { absoluteUrl, languageAlternates } from "@/lib/seo/metadata";

/**
 * Pages that exist in the site structure, each with its hreflang alternates;
 * English versions are listed as their own URLs too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Region pages change with their yield data.
  const regionLastModified = new Date(insolationUpdatedAt);
  // Backup region pages change with the outage wording (content/backup.ts).
  const backupLastModified = new Date(backupUpdatedAt);
  const modifiedAt = (path: string) =>
    regionPaths.includes(path) ? regionLastModified : backupRegionPaths.includes(path) ? backupLastModified : lastModified;
  const entry = (path: string, url: string) => ({
    url,
    lastModified: modifiedAt(path),
    alternates: { languages: languageAlternates(path) },
  });

  const ukPaths = [
    routes.home,
    routes.services.turnkeySes,
    routes.calculators.sesPayback,
    routes.solutions.hotel,
    routes.backup.hub,
    routes.cookies,
    ...productPages.map((page) => toPath(page.slug)),
    ...regionPaths,
    ...backupRegionPaths,
  ];

  return [
    ...ukPaths.map((path) => entry(path, absoluteUrl(path))),
    ...localizedPaths.map((path) =>
      entry(path, absoluteUrl(localizePath(path, "en"))),
    ),
  ];
}
