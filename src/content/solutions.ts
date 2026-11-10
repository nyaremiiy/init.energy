import type { Locale, Localized } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatQuantity } from "@/lib/format";

import { products, type ProductId } from "./products";
import { routes } from "./routes";
import type { SegmentIconId } from "./segments";

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
  segment: Localized;
  segmentIcon: SegmentIconId;
  title: Localized;
  description: Localized;
  products: ProductRef[];
  capacityProducts: ProductId[];
  /** Backup power pages exist in Ukrainian only. */
  ctaHref: string;
  tone: "light" | "navy" | "dark";
};

export const solutions: Solution[] = [
  {
    id: "apartment",
    index: "01",
    segment: { uk: "Квартира", en: "Apartment" },
    segmentIcon: "apartment",
    title: {
      uk: "Світло й зв'язок під час відключень",
      en: "Light and connectivity during outages",
    },
    description: {
      uk: "Роутер, освітлення, ноутбук і телефони. Працює від розетки, без монтажу.",
      en: "Router, lights, laptop and phones. Plugs into a socket, no installation.",
    },
    products: [{ product: "svit600" }],
    capacityProducts: ["svit600"],
    ctaHref: routes.backup.apartment,
    tone: "light",
  },
  {
    id: "house",
    index: "02",
    segment: { uk: "Приватний будинок", en: "Private house" },
    segmentIcon: "house",
    title: {
      uk: "Весь будинок без перебоїв",
      en: "The whole house without interruptions",
    },
    description: {
      uk: "Котел, насос і холодильник під час відключень, а вдень — власна сонячна енергія.",
      en: "Boiler, pump and fridge during outages, and your own solar energy by day.",
    },
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
    segment: { uk: "Бізнес", en: "Business" },
    segmentIcon: "business",
    title: {
      uk: "Безперервна робота підприємства",
      en: "Uninterrupted business operations",
    },
    description: {
      uk: "Виробництво, склад, готель чи критичний об'єкт: резерв і генерація під навантаження.",
      en: "Production, warehouses, hotels or critical sites: backup and generation sized to the load.",
    },
    products: [
      { product: "lithiumvalley" },
      { product: "svitPlus5000", count: 16 },
    ],
    capacityProducts: ["lithiumvalley"],
    ctaHref: routes.backup.business,
    tone: "dark",
  },
];

export function getSolutionLinks(
  solution: Solution,
  locale: Locale,
): SolutionLink[] {
  return solution.products.map((ref) => {
    const product = products[ref.product];
    const total = ref.count
      ? formatQuantity(
          {
            value: Math.floor(product.capacity.value * ref.count),
            unit: product.capacity.unit,
            qualifier: "upTo",
          },
          locale,
        )
      : formatQuantity(product.capacity, locale);

    return {
      label: ref.count ? `${product.name} × ${ref.count}` : product.name,
      spec: total,
      href: product.href,
    };
  });
}

export function getSolutionCapacity(
  solution: Solution,
  locale: Locale,
): string {
  const values = solution.capacityProducts.map(
    (id) => products[id].capacity.value,
  );
  const first = products[solution.capacityProducts[0]].capacity;
  const unit = getMessagesFor(locale).units[first.unit];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  if (solution.id === "apartment") {
    return formatQuantity(first, locale);
  }

  if (solution.id === "business") {
    return `${formatNumber(minimum, locale)}+ ${unit}`;
  }

  return `${formatNumber(Math.round(minimum), locale)}–${formatNumber(Math.round(maximum), locale)} ${unit}`;
}
