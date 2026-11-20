import { regionPaths } from "./insolation";
import { productPages } from "./product-pages";
import { featuredProjects } from "./projects";
import { localizePath, type Locale } from "@/i18n/config";

import { anchors, routes, sectionHref, toPath } from "./routes";

const hasProjects = featuredProjects.length > 0;

/** A navigation link; `labelKey` points to `messages.footer.links`. */
export type NavEntry = {
  href: string;
  labelKey: keyof FooterLinkLabels;
};

type FooterLinkLabels = {
  advantages: string;
  composition: string;
  inside: string;
  configurations: string;
  ports: string;
  runtime: string;
  specs: string;
  scaling: string;
  applications: string;
  solutions: string;
  products: string;
  aboutUs: string;
  projects: string;
  calculator: string;
  calculatorPage: string;
  faq: string;
  consultation: string;
  turnkeySes: string;
  sesSegments: string;
  sesTypes: string;
  sesHybrid: string;
  sesSteps: string;
  sesYield: string;
  sesMethod: string;
  sesRegions: string;
  regionYield: string;
  nicheFacts: string;
  nicheConsumers: string;
  nicheSizing: string;
  nicheBackup: string;
  nicheBuild: string;
  backupHub: string;
  backupHow: string;
  backupEquipment: string;
  backupRuntime: string;
  svitCatalog: string;
  about: string;
  contacts: string;
};

/**
 * "On this page" anchors, keyed by pathname. Pages without an entry get no
 * column in the footer (the grid closes up, no gap).
 */
function homeNavigation(locale: Locale): NavEntry[] {
  const section = (anchor: string, labelKey: NavEntry["labelKey"]) => ({
    href: sectionHref(anchor, locale),
    labelKey,
  });

  return [
    section(anchors.solutions, "solutions"),
    section(anchors.products, "products"),
    section(anchors.aboutUs, "aboutUs"),
    // The projects section renders only when there are visible (non-draft) cases.
    ...(hasProjects ? [section(anchors.projects, "projects")] : []),
    section(anchors.calculator, "calculator"),
    section(anchors.faq, "faq"),
    section(anchors.contacts, "consultation"),
  ];
}

/** Solar hub (/ses/): its sections in page order. */
function sesNavigation(locale: Locale): NavEntry[] {
  const section = (anchor: string, labelKey: NavEntry["labelKey"]) => ({
    href: localizePath(`${routes.services.turnkeySes}#${anchor}`, locale),
    labelKey,
  });

  return [
    section(anchors.sesSegments, "sesSegments"),
    section(anchors.sesTypes, "sesTypes"),
    section(anchors.sesHybrid, "sesHybrid"),
    section(anchors.aboutUs, "aboutUs"),
    section(anchors.sesSteps, "sesSteps"),
    section(anchors.products, "products"),
    ...(hasProjects ? [section(anchors.projects, "projects")] : []),
    section(anchors.sesRegions, "sesRegions"),
    section(anchors.calculator, "calculator"),
    section(anchors.faq, "faq"),
    section(anchors.contacts, "consultation"),
  ];
}

/** Region pages (/cec/{region}/): the same sections on every region. */
function regionNavigation(path: string, locale: Locale): NavEntry[] {
  const href = (anchor: string) => `${localizePath(path, locale)}#${anchor}`;
  return [
    { href: href(anchors.regionYield), labelKey: "regionYield" },
    { href: href(anchors.calculator), labelKey: "calculator" },
    { href: href(anchors.faq), labelKey: "faq" },
    { href: href(anchors.contacts), labelKey: "consultation" },
  ];
}

/** Backup power hub (/rezervne-zhyvlennya/): its main sections in page order. */
function backupNavigation(locale: Locale): NavEntry[] {
  const href = (anchor: string) => localizePath(`${routes.backup.hub}#${anchor}`, locale);
  return [
    { href: href(anchors.backupHow), labelKey: "backupHow" },
    { href: href(anchors.backupEquipment), labelKey: "backupEquipment" },
    { href: href(anchors.backupRuntime), labelKey: "backupRuntime" },
    { href: href(anchors.faq), labelKey: "faq" },
    { href: href(anchors.contacts), labelKey: "consultation" },
  ];
}

function sesCalculatorNavigation(locale: Locale): NavEntry[] {
  const path = localizePath(routes.calculators.sesPayback, locale);
  return [
    { href: `${path}#${anchors.calculator}`, labelKey: "calculator" },
    { href: `${path}#${anchors.sesYield}`, labelKey: "sesYield" },
    { href: `${path}#${anchors.sesMethod}`, labelKey: "sesMethod" },
    { href: `${path}#${anchors.faq}`, labelKey: "faq" },
    { href: `${path}#${anchors.contacts}`, labelKey: "consultation" },
  ];
}

/** Niche solar pages (/rishennya/{slug}/): the same sections for every niche. */
function nicheNavigation(path: string, locale: Locale): NavEntry[] {
  const href = (anchor: string) => `${localizePath(path, locale)}#${anchor}`;
  return [
    { href: href(anchors.nicheFacts), labelKey: "nicheFacts" },
    { href: href(anchors.nicheConsumers), labelKey: "nicheConsumers" },
    { href: href(anchors.nicheSizing), labelKey: "nicheSizing" },
    { href: href(anchors.nicheBackup), labelKey: "nicheBackup" },
    { href: href(anchors.nicheBuild), labelKey: "nicheBuild" },
    { href: href(anchors.faq), labelKey: "faq" },
    { href: href(anchors.contacts), labelKey: "consultation" },
  ];
}

export const pageNavigation: Record<string, NavEntry[]> = {
  [routes.solutions.hotel]: nicheNavigation(routes.solutions.hotel, "uk"),
  [localizePath(routes.solutions.hotel, "en")]: nicheNavigation(routes.solutions.hotel, "en"),
  [routes.home]: homeNavigation("uk"),
  [localizePath(routes.home, "en")]: homeNavigation("en"),
  [routes.services.turnkeySes]: sesNavigation("uk"),
  [localizePath(routes.services.turnkeySes, "en")]: sesNavigation("en"),
  [routes.backup.hub]: backupNavigation("uk"),
  [localizePath(routes.backup.hub, "en")]: backupNavigation("en"),
  [routes.calculators.sesPayback]: sesCalculatorNavigation("uk"),
  [localizePath(routes.calculators.sesPayback, "en")]: sesCalculatorNavigation("en"),
};

for (const path of regionPaths) {
  pageNavigation[path] = regionNavigation(path, "uk");
  pageNavigation[localizePath(path, "en")] = regionNavigation(path, "en");
}

/** Product pages: the same anchors as the sticky in-page nav. */
for (const page of productPages) {
  const path = toPath(page.slug);
  const productNavigation = (locale: Locale): NavEntry[] => {
    const localizedPath = localizePath(path, locale);
    const anchor = (id: string) => `${localizedPath}#${id}`;
    if (page.portable) {
      return [
        { href: anchor(anchors.advantages), labelKey: "advantages" },
        { href: anchor(anchors.ports), labelKey: "ports" },
        { href: anchor(anchors.runtime), labelKey: "runtime" },
        { href: anchor(anchors.specs), labelKey: "specs" },
        { href: anchor(anchors.applications), labelKey: "applications" },
        { href: anchor(anchors.faq), labelKey: "faq" },
      ];
    }
    if (page.configurations) {
      return [
        { href: anchor(anchors.advantages), labelKey: "advantages" },
        { href: anchor(anchors.configurations), labelKey: "configurations" },
        { href: anchor(anchors.specs), labelKey: "specs" },
        { href: anchor(anchors.applications), labelKey: "applications" },
        { href: anchor(anchors.faq), labelKey: "faq" },
      ];
    }
    const variableSection: NavEntry = page.inside
      ? { href: anchor(anchors.inside), labelKey: "inside" }
      : page.composition
      ? { href: anchor(anchors.composition), labelKey: "composition" }
      : { href: anchor(anchors.scaling), labelKey: "scaling" };

    return page.composition || page.inside
      ? [
          { href: anchor(anchors.advantages), labelKey: "advantages" },
          variableSection,
          { href: anchor(anchors.specs), labelKey: "specs" },
          { href: anchor(anchors.applications), labelKey: "applications" },
          { href: anchor(anchors.faq), labelKey: "faq" },
        ]
      : [
          { href: anchor(anchors.advantages), labelKey: "advantages" },
          { href: anchor(anchors.specs), labelKey: "specs" },
          variableSection,
          { href: anchor(anchors.applications), labelKey: "applications" },
          { href: anchor(anchors.faq), labelKey: "faq" },
        ];
  };

  pageNavigation[path] = productNavigation("uk");
  pageNavigation[localizePath(path, "en")] = productNavigation("en");
}

/**
 * Site sections. Built from the same routes as the header menu; only pages
 * that exist in the site structure (docs/ai/CONTEXT.md) are listed.
 */
export function getSiteSections(locale: Locale): NavEntry[] {
  return [
    { href: localizePath(routes.services.turnkeySes, locale), labelKey: "turnkeySes" },
    { href: localizePath(routes.backup.hub, locale), labelKey: "backupHub" },
    {
      href: localizePath(routes.calculators.sesPayback, locale),
      labelKey: "calculatorPage",
    },
    { href: localizePath(routes.catalog, locale), labelKey: "svitCatalog" },
    ...(hasProjects
      ? [
          {
            href: sectionHref(anchors.projects, locale),
            labelKey: "projects",
          } as const,
        ]
      : []),
    { href: routes.about, labelKey: "about" },
    { href: sectionHref(anchors.contacts, locale), labelKey: "contacts" },
    // TODO(content): «База знань» — add when the knowledge base enters the site structure.
  ];
}
