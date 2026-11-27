import { companyContacts, offices, type Office } from "@/content/company";
import { backupRegionPaths, insolationRegions, regionPaths } from "@/content/insolation";
import { sesPowerPages, sesPowerPath, sesPowerPaths, type SesPowerSegment } from "@/content/ses-power";
import { average, roundYear, stationYear } from "@/lib/calc/region-yield";
import { panelsForKw } from "@/lib/calc/ses-power";
import { products, type ProductId } from "@/content/products";
import { featuredProjects } from "@/content/projects";
import { pageNavigation } from "@/content/navigation";
import { productPages } from "@/content/product-pages";
import { anchors, routes, sectionHref, toPath } from "@/content/routes";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";
import { localizePath } from "@/i18n/config";

export type { Office };

export type NavLink = {
  href: string;
  label: string;
  /** Home section id; when set, the link highlights while that section is in view. */
  sectionId?: string;
};

export type NavMenuLink = NavLink & {
  description: string;
  /** Right-hand value (a product's capacity). */
  meta?: string;
};

export type NavColumn = {
  title: string;
  /** A line under the title («5–30 кВт · гібридні з батареєю»). */
  caption?: string;
  items: NavMenuLink[];
};

export type NavGroup = {
  label: string;
  /** «power»: the plant sizes menu — pills in an accordion on phones. */
  kind?: "power";
  columns: NavColumn[];
  /**
   * Bottom row of the panel: a line of text and one button. `contacts` leads to the
   * lead form of the current page (the same logic as the header CTA).
   */
  footer: { text: string; label: string; href: string; contacts?: boolean };
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "columns" in item;
}

export type Language = {
  code: string;
  label: string;
  href?: string;
};

export { offices };

export const contactEmail = companyContacts.email.display;

export type SocialNetwork = "facebook" | "instagram" | "linkedin" | "tiktok";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    network: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/init.energy",
  },
  {
    network: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/init.energy/",
  },
  {
    network: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/init-energy",
  },
  {
    network: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@init.energy",
  },
];

/** Header navigation for a locale (product and service pages are Ukrainian-only). */
export function getNavItems(locale: Locale): NavItem[] {
  const t = getMessagesFor(locale).chrome.header;
  const m = t.menu;
  const regionCount = format(m.regionCount, { count: formatNumber(insolationRegions.length, locale) });
  const link = (href: string, label: string, description: string): NavMenuLink => ({
    href: localizePath(href, locale),
    label,
    description,
  });
  const productLink = (id: ProductId): NavMenuLink => ({
    href: localizePath(products[id].href, locale),
    label: products[id].name,
    description: products[id].segment[locale],
    meta: formatQuantity(products[id].capacity, locale),
  });
  const section = (anchor: string, label: string): NavLink => ({
    href: sectionHref(anchor, locale),
    label,
    sectionId: anchor,
  });

  return [
    {
      label: t.nav.catalog,
      columns: [
        {
          title: m.catalogTitle,
          items: (["svit600", "svitHome", "svitPlus5000", "svitPlus16000", "lithiumvalley"] as const).map(productLink),
        },
      ],
      footer: { text: m.catalogFooter, label: m.catalogCta, href: sectionHref(anchors.compare, locale) },
    },
    {
      label: t.nav.solutions,
      columns: [
        {
          title: t.columns.solar,
          items: [
            link(routes.services.turnkeySes, m.ses, m.sesNote),
            link(`${routes.services.turnkeySes}#${anchors.sesRegions}`, m.sesRegions, regionCount),
            link(routes.solutions.hotel, m.hotel, m.hotelNote),
          ],
        },
        {
          title: t.columns.backup,
          items: [
            link(routes.backup.hub, m.backup, m.backupNote),
            link(`${routes.backup.hub}#${anchors.backupRegions}`, m.backupRegions, regionCount),
            link(routes.calculators.sesPayback, m.calculator, m.calculatorNote),
          ],
        },
      ],
      footer: { text: m.solutionsFooter, label: m.solutionsCta, href: sectionHref(anchors.contacts, locale), contacts: true },
    },
    ...powerGroup(locale),
    section(anchors.solutions, t.nav.solutionsSection),
    section(anchors.products, t.nav.products),
    section(anchors.aboutUs, t.nav.aboutUs),
    // The projects section renders only when there are visible cases; hide the link otherwise.
    ...(featuredProjects.length > 0
      ? [section(anchors.projects, t.nav.projects)]
      : []),
    section(anchors.contacts, t.nav.contacts),
  ];
}

/**
 * «Потужності»: the existing power pages (content/ses-power.ts) in «Для дому» and
 * «Для бізнесу»; a column without pages is left out, no group without any page.
 * Output and panels use the same formulas as the pages (national average yield).
 */
function powerGroup(locale: Locale): NavGroup[] {
  if (sesPowerPages.length === 0) return [];
  const messages = getMessagesFor(locale);
  const m = messages.chrome.header.menu;
  const n = (value: number) => formatNumber(value, locale);
  const nationalYield = average(insolationRegions.map((region) => region.yield));
  const yearText = (kw: number) => {
    const year = roundYear(stationYear(nationalYield, kw));
    // From 100 000 kWh a year — in MWh («≈ 118 МВт·год»).
    return year >= 100_000 ? `${n(Math.round(year / 1000))} ${messages.units.MWh}` : `${n(year)} ${messages.units.kWh}`;
  };
  const column = (segment: SesPowerSegment, title: string, caption: (kws: number[]) => string): NavColumn[] => {
    const pages = sesPowerPages.filter((page) => page.segment === segment).toSorted((a, b) => a.kw - b.kw);
    if (pages.length === 0) return [];
    return [
      {
        title,
        caption: caption(pages.map((page) => page.kw)),
        items: pages.map((page) => ({
          href: localizePath(sesPowerPath(page), locale),
          label: `${n(page.kw)} ${messages.units.kW}`,
          description: `${format(m.powerYear, { value: yearText(page.kw) })} · ${format(m.powerPanels, { panels: n(panelsForKw(page.kw)) })}`,
        })),
      },
    ];
  };

  return [
    {
      kind: "power",
      label: messages.chrome.header.nav.power,
      columns: [
        ...column("home", m.powerHome, (kws) =>
          kws.length > 1 ? format(m.powerHomeNote, { min: n(kws[0]), max: n(kws[kws.length - 1]) }) : format(m.powerHomeNoteOne, { kw: n(kws[0]) }),
        ),
        ...column("business", m.powerBusiness, (kws) => format(m.powerBusinessNote, { min: n(kws[0]) })),
      ],
      footer: { text: m.powerFooter, label: m.powerCta, href: localizePath(routes.calculators.sesPayback, locale) },
    },
  ];
}

export const languages: { code: Locale; label: string }[] = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
];

export const officeRotationInterval = 5000;

/** Home page URLs (Ukrainian at the root, English under /en/). */
export function isHomePath(pathname: string | null): boolean {
  return pathname !== null && /^\/(en\/)?$/.test(pathname);
}

/**
 * Pages with their own section links in the header (Ukrainian path → main
 * sections). Only the main ones: the full list stays in the footer column.
 */
const headerSectionKeys: Record<string, string[]> = {
  [routes.services.turnkeySes]: ["sesSegments", "products", "sesRegions", "calculator"],
  [routes.solutions.hotel]: ["nicheFacts", "nicheSizing", "nicheBackup", "faq"],
  [routes.calculators.sesPayback]: ["calculator", "sesYield", "sesMethod", "faq"],
  // Four links fit next to the menus at 1280 px; «Обладнання» stays in the footer column.
  [routes.backup.hub]: ["backupHow", "backupRuntime", "backupRegions", "faq"],
  ...Object.fromEntries(regionPaths.map((path) => [path, ["regionYield", "calculator", "faq"]])),
  ...Object.fromEntries(sesPowerPaths.map((path) => [path, ["powerYield", "calculator", "powerTypes", "faq"]])),
  ...Object.fromEntries(backupRegionPaths.map((path) => [path, ["backupChoice", "backupRuntime", "faq"]])),
};

/** Product pages: no section links, but the solar hub and the calculator (cross-sell). */
const productPaths = new Set(productPages.map((page) => toPath(page.slug)));

/** Ukrainian paths that have links in the left cluster of the header (desktop). */
export const headerLinkPaths: string[] = [...Object.keys(headerSectionKeys), ...productPaths];

/**
 * Links of the page at `pathname` for the left cluster of the header: its
 * main sections (labelled like the footer column), or on product pages the
 * solar hub and the payback calculator. Empty for other pages.
 */
export function pageSectionLinks(pathname: string | null, locale: Locale): NavLink[] {
  const ukPath = pathname?.replace(/^\/en(?=\/)/, "") ?? "";
  if (pathname !== localizePath(ukPath, locale)) return [];
  const labels = getMessagesFor(locale).footer.links;

  if (productPaths.has(ukPath)) {
    return [
      { href: localizePath(routes.services.turnkeySes, locale), label: labels.turnkeySes },
      { href: localizePath(routes.calculators.sesPayback, locale), label: labels.calculatorPage },
    ];
  }

  const keys = headerSectionKeys[ukPath];
  if (!keys) return [];
  const entries = pageNavigation[pathname] ?? [];
  return entries.filter((entry) => keys.includes(entry.labelKey)).flatMap((entry) => {
    const sectionId = entry.href.split("#")[1];
    return sectionId
      ? [{ href: entry.href, label: labels[entry.labelKey], sectionId }]
      : [];
  });
}
