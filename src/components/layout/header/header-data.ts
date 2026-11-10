import { companyContacts, offices, type Office } from "@/content/company";
import { products, productSummary, type ProductId } from "@/content/products";
import { featuredProjects } from "@/content/projects";
import { anchors, sectionHref } from "@/content/routes";
import { services, type ServiceId } from "@/content/services";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";

export type { Office };

export type NavLink = {
  href: string;
  label: string;
  /** Home section id; when set, the link highlights while that section is in view. */
  sectionId?: string;
};

export type NavMenuLink = NavLink & {
  description: string;
};

export type NavColumn = {
  title: string;
  items: NavMenuLink[];
};

export type NavGroup = {
  label: string;
  columns: NavColumn[];
};

export function getNavCta(locale: Locale) {
  const t = getMessagesFor(locale).chrome.header.menuCta;
  return {
    title: t.title,
    text: t.text,
    href: sectionHref(anchors.contacts, locale),
    label: t.label,
  };
}

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
  const productLink = (id: ProductId): NavMenuLink => ({
    href: products[id].href,
    label: products[id].name,
    description: productSummary(id, locale),
  });
  const serviceLink = (id: ServiceId): NavMenuLink => ({
    href: services[id].href,
    label: services[id].name[locale],
    description: services[id].summary[locale],
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
          title: t.columns.backup,
          items: [productLink("svitHome"), productLink("svit600")],
        },
        {
          title: t.columns.batteries,
          items: [productLink("svitPlus5000"), productLink("svitPlus16000")],
        },
        { title: t.columns.business, items: [productLink("lithiumvalley")] },
      ],
    },
    {
      label: t.nav.solutions,
      columns: [
        { title: t.columns.solar, items: [serviceLink("turnkeySes")] },
        { title: t.columns.industry, items: [serviceLink("hotelSes")] },
      ],
    },
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

export const languages: { code: Locale; label: string }[] = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
];

export const officeRotationInterval = 5000;

/** Home page URLs (Ukrainian at the root, English under /en/). */
export function isHomePath(pathname: string | null): boolean {
  return pathname !== null && /^\/(en\/)?$/.test(pathname);
}
