import { formatNumber, formatQuantity } from "@/lib/format";
import { messages } from "@/lib/messages";

import { products, type ProductId } from "./products";
import type { SegmentIconId } from "./segments";
import { routes } from "./routes";

export type SolutionLink = {
  label: string;
  /** Key spec shown muted on the right (products only). */
  spec?: string;
  href: string;
};

type ProductRef = { product: ProductId; count?: number };

export type Solution = {
  id: "apartment" | "house" | "business";
  index: string;
  segment: string;
  segmentIcon: SegmentIconId;
  title: string;
  description: string;
  products: ProductRef[];
  capacityProducts: ProductId[];
  ctaHref: string;
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
    products: [{ product: "svit600" }],
    capacityProducts: ["svit600"],
    ctaHref: routes.backup.apartment,
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
    products: [
      { product: "svitHome" },
      { product: "svitPlus5000" },
      { product: "svitPlus16000" },
    ],
    capacityProducts: ["svitHome", "svitPlus5000", "svitPlus16000"],
    ctaHref: routes.backup.house,
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
    products: [
      { product: "lithiumvalley" },
      { product: "svitPlus5000", count: 16 },
    ],
    capacityProducts: ["lithiumvalley"],
    ctaHref: routes.backup.business,
    tone: "dark",
  },
];

export function getSolutionLinks(solution: Solution): SolutionLink[] {
  return solution.products.map((ref) => {
    const product = products[ref.product];
    const total = ref.count
      ? formatQuantity({
          value: Math.floor(product.capacity.value * ref.count),
          unit: product.capacity.unit,
          qualifier: "upTo",
        })
      : formatQuantity(product.capacity);

    return {
      label: ref.count ? `${product.name} × ${ref.count}` : product.name,
      spec: total,
      href: product.href,
    };
  });
}

export function getSolutionCapacity(solution: Solution): string {
  const values = solution.capacityProducts.map((id) => products[id].capacity.value);
  const first = products[solution.capacityProducts[0]].capacity;
  const unit = messages.units[first.unit];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  if (solution.id === "apartment") {
    return formatQuantity(first);
  }

  if (solution.id === "business") {
    return `${formatNumber(minimum)}+ ${unit}`;
  }

  return `${formatNumber(Math.round(minimum))}–${formatNumber(Math.round(maximum))} ${unit}`;
}
