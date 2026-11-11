import { localizePath, type Locale } from "@/i18n/config";

// Single source of URL slugs. Build paths with `toPath`, never hardcode them in JSX.
// Page structure mirrors https://init.energy (see docs/ai/CONTEXT.md).
export const slugs = {
  // TODO(content): catalog page with all SVIT products — planned, not built yet.
  catalog: "svit",
  // TODO(content): about page — planned by the owner, not built yet.
  about: "pro-nas",
  // TODO(content): projects archive and individual case pages are planned.
  projects: "proekty",
  // TODO(content): privacy policy page is planned, not built yet.
  privacy: "polityka-konfidentsiinosti",
  // TODO(content): cookie policy and terms pages are planned, not built yet.
  cookies: "polityka-cookie",
  terms: "umovy-vykorystannya",
  products: {
    svit600: "svit-600",
    svitPlus5000: "svit-plus-5000",
    svitPlus16000: "svit-plus-16000",
    svitHome: "svit-home",
    lithiumvalley: "bess",
  },
  services: {
    turnkeySes: "cec",
    // TODO(content): solar plant pages per segment are planned, not built yet.
    house: "dlya-domu",
    business: "dlya-biznesu",
  },
  backup: {
    hub: "rezervne-zhyvlennya",
    apartment: "dlya-kvartyry",
    house: "dlya-budynku",
    business: "dlya-biznesu",
  },
  /** Niche solar pages: /ses/{slug}/ (data: `solutionPages` in content/solutions.ts). */
  sesNiche: {
    hub: "ses",
    hotel: "dlya-gotelyu",
  },
  calculators: { hub: "kalkulyator", sesPayback: "okupnist-ses" },
} as const;

/** Home page section anchors. */
export const anchors = {
  solutions: "solutions",
  aboutUs: "about-us",
  products: "products",
  /** Comparison table under the product tabs. */
  compare: "compare",
  projects: "projects",
  calculator: "calculator",
  faq: "faq",
  contacts: "contacts",
  // Product pages.
  advantages: "advantages",
  composition: "composition",
  inside: "inside",
  configurations: "configurations",
  ports: "ports",
  runtime: "runtime",
  specs: "specs",
  scaling: "scaling",
  applications: "applications",
  process: "process",
  sesSegments: "ses-segments",
  sesTypes: "ses-types",
  sesHybrid: "ses-hybrid",
  sesSteps: "ses-steps",
  // Niche solar pages (/ses/{slug}/).
  nicheFacts: "facts",
  nicheConsumers: "consumers",
  nicheSizing: "sizing",
  nicheBackup: "backup",
  nicheBuild: "build",
  sesYield: "ses-yield",
  sesMethod: "ses-method",
} as const;

export function toPath(...segments: string[]): string {
  return segments.length ? `/${segments.join("/")}/` : "/";
}

export function toAnchor(anchor: string): string {
  return `${toPath()}#${anchor}`;
}

export const routes = {
  home: toPath(),
  catalog: toPath(slugs.catalog),
  about: toPath(slugs.about),
  projects: toPath(slugs.projects),
  privacy: toPath(slugs.privacy),
  cookies: toPath(slugs.cookies),
  terms: toPath(slugs.terms),
  /** Rewrite target for planned pages (src/proxy.ts); not linked, never indexed. */
  inProgress: toPath("v-rozrobtsi"),
  products: {
    svit600: toPath(slugs.products.svit600),
    svitPlus5000: toPath(slugs.products.svitPlus5000),
    svitPlus16000: toPath(slugs.products.svitPlus16000),
    svitHome: toPath(slugs.products.svitHome),
    lithiumvalley: toPath(slugs.products.lithiumvalley),
  },
  services: {
    turnkeySes: toPath(slugs.services.turnkeySes),
    house: toPath(slugs.services.turnkeySes, slugs.services.house),
    business: toPath(slugs.services.turnkeySes, slugs.services.business),
  },
  backup: {
    apartment: toPath(slugs.backup.hub, slugs.backup.apartment),
    house: toPath(slugs.backup.hub, slugs.backup.house),
    business: toPath(slugs.backup.hub, slugs.backup.business),
  },
  sesNiche: {
    hotel: toPath(slugs.sesNiche.hub, slugs.sesNiche.hotel),
  },
  calculators: {
    sesPayback: toPath(slugs.calculators.hub, slugs.calculators.sesPayback),
  },
  sections: {
    solutions: toAnchor(anchors.solutions),
    aboutUs: toAnchor(anchors.aboutUs),
    projects: toAnchor(anchors.projects),
    products: toAnchor(anchors.products),
    calculator: toAnchor(anchors.calculator),
    faq: toAnchor(anchors.faq),
    contacts: toAnchor(anchors.contacts),
  },
} as const;

/**
 * Pages that are linked from the site but not built yet. They render the
 * «page in progress» screen (still a 404 with noindex) instead of a bare 404.
 * Remove a path from here when its page is created.
 */
export const plannedPaths: readonly string[] = [
  routes.catalog,
  routes.about,
  routes.projects,
  routes.privacy,
  routes.cookies,
  routes.terms,
  routes.backup.apartment,
  routes.backup.house,
  routes.backup.business,
  routes.services.house,
  routes.services.business,
];

/**
 * A home-page anchor in a locale: "/#contacts" on Ukrainian pages,
 * "/en/#contacts" on English ones.
 */
export function sectionHref(anchor: string, locale: Locale): string {
  return localizePath(toAnchor(anchor), locale);
}
