import { formatQuantity } from "@/lib/format";

import { products, type ProductId } from "./products";
import type { SegmentIconId } from "./segments";
import { services, type ServiceId } from "./services";

export type SolutionLink = {
  label: string;
  /** Key spec shown muted on the right (products only). */
  spec?: string;
  href: string;
};

type LinkRef = { product: ProductId } | { service: ServiceId };

export type Solution = {
  id: "apartment" | "house" | "business";
  index: string;
  segment: string;
  segmentIcon: SegmentIconId;
  title: string;
  description: string;
  links: LinkRef[];
  tone: "light" | "navy" | "dark";
};

// Ukrainian only for now; EN arrives with i18n routing.
export const solutions: Solution[] = [
  {
    id: "apartment",
    index: "01",
    segment: "Квартира",
    segmentIcon: "apartment",
    title: "Світло й зв'язок під час відключень",
    description:
      "Роутер, освітлення, ноутбук і телефони. Працює від розетки, без монтажу.",
    links: [{ product: "svit600" }],
    tone: "light",
  },
  {
    id: "house",
    index: "02",
    segment: "Приватний будинок",
    segmentIcon: "house",
    title: "Весь будинок без перебоїв",
    description:
      "Котел, насос і холодильник під час відключень, а вдень — власна сонячна енергія.",
    links: [
      { product: "svitHome" },
      { product: "svitPlus5000" },
      { product: "svitPlus16000" },
      { service: "turnkeySes" },
    ],
    tone: "navy",
  },
  {
    id: "business",
    index: "03",
    segment: "Бізнес",
    segmentIcon: "business",
    title: "Безперервна робота підприємства",
    description:
      "Виробництво, склад, готель чи критичний об'єкт: резерв і генерація під навантаження.",
    links: [
      { product: "lithiumvalley" },
      { service: "turnkeySes" },
      { service: "hotelSes" },
    ],
    tone: "dark",
  },
];

export function getSolutionLinks(solution: Solution): SolutionLink[] {
  return solution.links.map((ref) => {
    if ("product" in ref) {
      const product = products[ref.product];

      return {
        label: product.name,
        spec: formatQuantity(product.capacity),
        href: product.href,
      };
    }

    const service = services[ref.service];

    return { label: service.name, href: service.href };
  });
}
