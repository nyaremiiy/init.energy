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

export type SesPowerHero = { image: HeroImage; alt: Localized };

/**
 * One hero for every plant up to 50 kW (owner's decision 2026-11-27): a house
 * with panels on the roof (owner's file, 4608 × 3456). Cut like the /cec/ hero:
 * 3:2 for screens, the middle around the chimney for phones. New file names
 * (not 01-*) so cached copies of the previous photo are not reused (/images/* is cached for 7 days).
 */
export const smallPlantHero: SesPowerHero = {
  image: {
    desktop: "/images/cec/power/up-to-50/house-2560.avif",
    fallback: "/images/cec/power/up-to-50/house-1920.webp",
    wide: "/images/cec/power/up-to-50/house-1920.avif",
    laptop: "/images/cec/power/up-to-50/house-1440.avif",
    tablet: "/images/cec/power/up-to-50/house-1280.avif",
    mobile: "/images/cec/power/up-to-50/house-750.avif",
    mobilePortrait: "/images/cec/power/up-to-50/house-portrait.avif",
    // The roof with the panels is in the upper part: crop from the top (owner, 2026-11-27).
    position: "top",
    type: "image/avif",
  },
  alt: {
    uk: "Сонячні панелі на даху приватного будинку",
    en: "Solar panels on the roof of a private house",
  },
};

/** The largest plant that uses `smallPlantHero`, kW. */
const SMALL_PLANT_MAX_KW = 50;

export type SesPowerPage = {
  kw: number;
  /** /cec/{slug}/ and /en/cec/{slug}/; never one of the region slugs. */
  slug: string;
  segment: SesPowerSegment;
  /** Own hero photo; without it a plant up to 50 kW gets `smallPlantHero` (owner, 2026-11-27). */
  hero?: SesPowerHero;
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
    consumption: { min: 150, max: 1000, step: 10, default: 450 },
    defaultRegionId: "lvivska",
    updatedAt: "2026-11-27",
  },
];

/**
 * Hero of a power page: its own photo, or the shared one up to 50 kW.
 * Larger plants need their own photo (TODO(content) when the first one is added).
 */
export function sesPowerHero(page: Pick<SesPowerPage, "kw" | "hero">): SesPowerHero {
  if (page.hero) return page.hero;
  if (page.kw <= SMALL_PLANT_MAX_KW) return smallPlantHero;
  throw new Error(`The ${page.kw} kW page needs its own hero photo (content/ses-power.ts).`);
}

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
