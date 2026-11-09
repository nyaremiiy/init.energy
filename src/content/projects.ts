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
  region: string;
  powerKw: number;
  /** Product from `products.ts`, used for the equipment cross-link. */
  equipment: ProductId;
  year: number;
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
    // TODO(content): ~180 kW is the owner's estimate from the photo — confirm power, equipment and capacity.
    powerKw: 180,
    equipment: "lithiumvalley",
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
    slug: "test-private-house-lviv",
    segment: "house",
    title: "Тестовий приватний будинок",
    city: "Львів",
    region: "Львівська область",
    powerKw: 15,
    equipment: "svitHome",
    year: 2025,
    image: null,
    featured: true,
    draft: true,
  },
  {
    slug: "test-apartment-kyiv",
    segment: "apartment",
    title: "Тестова квартира з резервом",
    city: "Київ",
    region: "місто Київ",
    powerKw: 0.6,
    equipment: "svit600",
    year: 2025,
    image: null,
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
