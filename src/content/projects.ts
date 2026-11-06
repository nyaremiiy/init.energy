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
  city: string;
  region: string;
  powerKw: number;
  /** Product from `products.ts`, used for the equipment cross-link. */
  equipment: ProductId;
  year: number;
  /** `null` renders MediaPlaceholder until content supplies a real photo. */
  image: ProjectImage | null;
  featured: boolean;
};

/**
 * TODO(content): Temporary demonstration records requested by the owner.
 * Replace every field with verified project data and a meaningful image before
 * publishing the projects archive or individual case pages.
 */
export const projectList: Project[] = [
  {
    slug: "test-logistics-complex-kyiv-region",
    segment: "business",
    title: "Тестовий логістичний комплекс",
    city: "Київ",
    region: "Київська область",
    powerKw: 500,
    equipment: "lithiumvalley",
    year: 2025,
    image: null,
    featured: true,
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
  },
];
