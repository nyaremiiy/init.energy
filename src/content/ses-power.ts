import type { HeroImage } from "@/components/sections/hero/hero-picture";
import type { Localized } from "@/i18n/config";

/**
 * «Solar plant by power» pages (/cec/5-kvt/ …): one template, one record per
 * power (owner, 2026-11-27). A new power = a record here + a hero photo; the
 * menu «Потужності», sitemap, `localizedPaths`, llms.txt and «Інші потужності»
 * read this list. Every number on the page is computed (lib/calc/ses-power.ts,
 * content/insolation.ts, tariffs.ts, backup.ts) — none is written here.
 *
 * Owner's rules for these pages: no prices («рахуємо під об'єкт»), no cases
 * yet, equipment of any brand to the client's budget, batteries described
 * neutrally (SVIT only next to Deye, Victron, Huawei).
 */

export type SesPowerSegment = "home" | "business";

export type SesPowerPage = {
  kw: number;
  /** /cec/{slug}/ and /en/cec/{slug}/; never one of the region slugs. */
  slug: string;
  segment: SesPowerSegment;
  hero: { image: HeroImage; alt: Localized };
  /** The consumption slider of the calculator, kWh a month. */
  consumption: { min: number; max: number; step: number; default: number };
  /** Region preselected in the calculator (id in content/insolation.ts). */
  defaultRegionId: string;
  /** Revision date of the copy and numbers (sitemap, WebPage `dateModified`, «Оновлено»). */
  updatedAt: string;
};

export const sesPowerPages: SesPowerPage[] = [
  {
    kw: 5,
    slug: "5-kvt",
    segment: "home",
    hero: {
      // Owner's photo (2026-11-27); temporary until a photo per power arrives.
      image: {
        desktop: "/images/cec/power/5-kvt/01-1920.avif",
        fallback: "/images/cec/power/5-kvt/01-1920.webp",
        laptop: "/images/cec/power/5-kvt/01-1440.avif",
        tablet: "/images/cec/power/5-kvt/01-1280.avif",
        mobile: "/images/cec/power/5-kvt/01-750.avif",
        mobilePortrait: "/images/cec/power/5-kvt/01-portrait.avif",
        wide: "/images/cec/power/5-kvt/01-1920.avif",
        type: "image/avif",
      },
      alt: {
        uk: "Сонячні панелі на скатному даху приватного будинку",
        en: "Solar panels on the pitched roof of a private house",
      },
    },
    consumption: { min: 150, max: 1000, step: 10, default: 450 },
    defaultRegionId: "lvivska",
    updatedAt: "2026-11-27",
  },
];

export function sesPowerPath(page: Pick<SesPowerPage, "slug">): string {
  return `/cec/${page.slug}/`;
}

export const sesPowerPaths: string[] = sesPowerPages.map(sesPowerPath);

export function sesPowerBySlug(slug: string): SesPowerPage | undefined {
  return sesPowerPages.find((page) => page.slug === slug);
}

export function sesPowerByKw(kw: number): SesPowerPage | undefined {
  return sesPowerPages.find((page) => page.kw === kw);
}

/** Batteries the outage figures are worked out for: ≈ 5 and ≈ 16 kWh (5.12 / 16.07 kWh units), named neutrally. */
export const referenceBatteries = ["svitPlus5000", "svitPlus16000"] as const;
