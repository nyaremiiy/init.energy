import { featuredProjects } from "./projects";
import { routes } from "./routes";

const hasProjects = featuredProjects.length > 0;

/** A navigation link; `labelKey` points to `messages.footer.links`. */
export type NavEntry = {
  href: string;
  labelKey: keyof FooterLinkLabels;
};

type FooterLinkLabels = {
  solutions: string;
  products: string;
  aboutUs: string;
  projects: string;
  calculator: string;
  consultation: string;
  turnkeySes: string;
  svitCatalog: string;
  about: string;
  contacts: string;
};

/**
 * "On this page" anchors, keyed by pathname. Pages without an entry get no
 * column in the footer (the grid closes up, no gap).
 */
export const pageNavigation: Record<string, NavEntry[]> = {
  [routes.home]: [
    { href: routes.sections.solutions, labelKey: "solutions" },
    { href: routes.sections.products, labelKey: "products" },
    { href: routes.sections.aboutUs, labelKey: "aboutUs" },
    // The projects section renders only when there are visible (non-draft) cases.
    ...(hasProjects
      ? [{ href: routes.sections.projects, labelKey: "projects" } as const]
      : []),
    { href: routes.sections.calculator, labelKey: "calculator" },
    { href: routes.sections.contacts, labelKey: "consultation" },
  ],
};

/**
 * Site sections. Built from the same routes as the header menu; only pages
 * that exist in the site structure (docs/ai/CONTEXT.md) are listed.
 */
export const siteSections: NavEntry[] = [
  { href: routes.services.turnkeySes, labelKey: "turnkeySes" },
  { href: routes.catalog, labelKey: "svitCatalog" },
  ...(hasProjects
    ? [{ href: routes.sections.projects, labelKey: "projects" } as const]
    : []),
  { href: routes.about, labelKey: "about" },
  { href: routes.sections.contacts, labelKey: "contacts" },
  // TODO(content): «Резервне живлення», «Калькулятори», «База знань» — add when these pages enter the site structure.
];
