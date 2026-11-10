import type { Localized } from "@/i18n/config";
import type { ProductId } from "./products";

export type ProjectSegment = "apartment" | "house" | "business";

export type ProjectImage = {
  src: string;
  alt: Localized;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  segment: ProjectSegment;
  title: Localized;
  /** Omit when only the oblast is known. */
  city?: Localized;
  /** Unknown values are omitted and their rows are hidden on the card. */
  region?: Localized;
  powerKw?: number;
  /** Battery from `products.ts` (equipment cross-link); omit for solar-only plants. */
  equipment?: ProductId;
  year?: number;
  /** `null` renders MediaPlaceholder until content supplies a real photo. */
  image: ProjectImage | null;
  featured: boolean;
  /** Demo/test record: shown only in development, never in production. */
  draft?: boolean;
};

/**
 * TODO(content): Records with real photos but partly invented specs (marked
 * PLACEHOLDER) at the owner's request. Keep `draft: true` until every value
 * is confirmed — drafts are shown only in development.
 *
 * Earlier note: temporary demonstration records requested by the owner.
 * Replace every field with verified project data and a meaningful image before
 * publishing the projects archive or individual case pages.
 */
export const projectList: Project[] = [
  {
    slug: "reserve-power-system-lviv-region",
    segment: "business",
    title: { uk: "Система резервного живлення", en: "Backup power system" },
    region: { uk: "Львівська область", en: "Lviv Oblast" },
    // Owner: 3 racks × 13 SVIT PLUS 5000 modules = 39 × 5,12 ≈ 200 kWh of storage.
    // TODO(content): owner estimated "~180" — confirm whether that is inverter power (kW) or storage (kWh).
    powerKw: 180,
    equipment: "svitPlus5000",
    // PLACEHOLDER (invented at the owner's request): year not confirmed.
    year: 2025,
    image: {
      src: "/images/projects/03.avif",
      alt: {
        uk: "Технічне приміщення з трьома стійками акумуляторних модулів і гібридними інверторами та розподільчими шафами",
        en: "Plant room with three racks of battery modules, hybrid inverters and distribution cabinets",
      },
      width: 1672,
      height: 941,
    },
    featured: true,
    draft: true,
  },
  {
    slug: "ses-brewery-roof-lviv-region",
    segment: "business",
    title: {
      uk: "СЕС на даху пивоварного заводу",
      en: "Rooftop solar plant at a brewery",
    },
    region: { uk: "Львівська область", en: "Lviv Oblast" },
    // TODO(content): owner's estimate "about 200 kW" — confirm power.
    powerKw: 200,
    // PLACEHOLDER (invented at the owner's request): year not confirmed.
    year: 2024,
    image: {
      src: "/images/projects/02.avif",
      alt: {
        uk: "Сонячні панелі на даху цеху пивоварного заводу у Львівській області",
        en: "Solar panels on the roof of a brewery building in Lviv Oblast",
      },
      width: 1024,
      height: 576,
    },
    featured: true,
    draft: true,
  },
  {
    slug: "ses-outbuilding-roof",
    segment: "house",
    title: {
      uk: "СЕС на даху господарської будівлі",
      en: "Solar plant on an outbuilding roof",
    },
    // PLACEHOLDER (invented at the owner's request): ~30 panels on the photo ≈ 15 kW;
    // region and year are not confirmed. Replace before removing `draft`.
    region: { uk: "Львівська область", en: "Lviv Oblast" },
    powerKw: 15,
    year: 2025,
    image: {
      src: "/images/projects/01.jpg",
      alt: {
        uk: "Монтаж сонячних панелей на даху господарської будівлі",
        en: "Installing solar panels on the roof of an outbuilding",
      },
      width: 1280,
      height: 720,
    },
    featured: true,
    draft: true,
  },
];

/** Projects that may be shown: drafts only in development. */
export const visibleProjects = projectList.filter(
  (project) => !project.draft || process.env.NODE_ENV === "development",
);

/** Featured projects for the home page showcase (max 3). */
export const featuredProjects = visibleProjects
  .filter((project) => project.featured)
  .slice(0, 3);
