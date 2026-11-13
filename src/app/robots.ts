import type { MetadataRoute } from "next";

import { routes } from "@/content/routes";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Service screens: shown under other URLs (proxy rewrites), never indexed.
      disallow: [
        routes.inProgress,
        `/en${routes.inProgress}`,
        `/en${routes.notFoundEn}`,
        routes.maintenance,
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
