import type { ProductId } from "./products";

export type ProjectSegment = "apartment" | "house" | "business";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  segment: ProjectSegment;
  title: string;
  /** Omit when only the oblast is known. */
  city?: string;
  /** Unknown values are omitted and their rows are hidden on the card. */
  region?: string;
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
 * TODO(content): Temporary demonstration records requested by the owner.
 * Replace every field with verified project data and a meaningful image before
 * publishing the projects archive or individual case pages.
 */
export const projectList: Project[] = [
  {
    slug: "reserve-power-system-lviv-region",
    segment: "business",
    title: "Система резервного живлення",
    region: "Львівська область",
    // Owner: 3 racks × 13 SVIT PLUS 5000 modules = 39 × 5,12 ≈ 200 kWh of storage.
    // TODO(content): owner estimated "~180" — confirm whether that is inverter power (kW) or storage (kWh).
    powerKw: 180,
    equipment: "svitPlus5000",
    year: 2025,
    image: {
      src: "/images/projects/03.avif",
      alt: "Технічне приміщення з трьома стійками акумуляторних модулів і гібридними інверторами та розподільчими шафами",
      width: 1672,
      height: 941,
    },
    featured: true,
    draft: true,
  },
  {
    slug: "ses-brewery-roof-lviv-region",
    segment: "business",
    title: "СЕС на даху пивоварного заводу",
    region: "Львівська область",
    // TODO(content): owner's estimate "about 200 kW" — confirm power and the year.
    powerKw: 200,
    year: 2025,
    image: {
      src: "/images/projects/02.avif",
      alt: "Сонячні панелі на даху цеху пивоварного заводу у Львівській області",
      width: 1024,
      height: 576,
    },
    featured: true,
    draft: true,
  },
  {
    slug: "ses-outbuilding-roof",
    segment: "house",
    title: "СЕС на даху господарської будівлі",
    // TODO(content): power, region, year and equipment are unknown — fill in when confirmed.
    image: {
      src: "/images/projects/01.jpg",
      alt: "Монтаж сонячних панелей на даху господарської будівлі",
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
