import { formatNumber, formatQuantity, type Quantity } from "@/lib/format";

import { routes } from "./routes";

// Source: product pages on https://init.energy (checked 2026-11-06).
// Ukrainian only for now; EN arrives with i18n routing.
export type ProductId =
  "svit600" | "svitHome" | "svitPlus5000" | "svitPlus16000" | "lithiumvalley";

/** Keys of `messages.specs` used as spec row labels. */
export type SpecKey =
  | "capacity"
  | "power"
  | "chemistry"
  | "inverter"
  | "cycles"
  | "minCapacity"
  | "maxCapacity"
  | "type";

export type ProductSpec = {
  key: SpecKey;
  value: Quantity | string;
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  id: ProductId;
  name: string;
  href: string;
  /** Product type for the comparison table. */
  type: string;
  /** Who it is for; `undefined` = not stated on init.energy yet. */
  audience?: string;
  /** Short description for product cards. */
  description: string;
  /** Main capacity, shown in tables and solution cards. */
  capacity: Quantity;
  /** Rows of the product card spec list. */
  specs: ProductSpec[];
  /** Featured in the product line cards. */
  featured?: { segment: string; tone: "light" | "dark" };
  image?: ProductImage;
};

/** Ordered product line: cards and the comparison table read from this list. */
export const productList: Product[] = [
  {
    id: "svit600",
    name: "SVIT 600",
    href: routes.products.svit600,
    type: "Портативна станція",
    audience: "Квартира",
    description: "Портативна станція для квартири",
    capacity: { value: 865, unit: "Wh" },
    specs: [
      { key: "capacity", value: { value: 865, unit: "Wh" } },
      { key: "power", value: { value: 600, unit: "W" } },
      { key: "chemistry", value: "LiFePO₄" },
    ],
    featured: { segment: "Квартира", tone: "light" },
    // TODO(content): фото
  },
  {
    id: "svitHome",
    name: "SVIT HOME",
    href: routes.products.svitHome,
    type: "Комплекс резервного живлення",
    audience: "Приватний будинок",
    description: "Резервне живлення для всього будинку",
    capacity: { value: 5.12, unit: "kWh" },
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "inverter", value: { value: 6, unit: "kW" } },
      {
        key: "cycles",
        value: { value: 6000, unit: "cycles", qualifier: "plus" },
      },
    ],
    featured: { segment: "Приватний будинок", tone: "light" },
    // TODO(content): фото
  },
  {
    id: "svitPlus5000",
    name: "SVIT PLUS 5000",
    href: routes.products.svitPlus5000,
    type: "Батарея",
    // Source: /svit-plus-5000/ — «Підходить як для дому, так і для бізнесу».
    audience: "Дім і бізнес",
    description: "Акумуляторна батарея LiFePO₄",
    capacity: { value: 5.12, unit: "kWh" },
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "power", value: { value: 5, unit: "kW" } },
      { key: "chemistry", value: "LiFePO₄" },
    ],
    // TODO(content): фото
  },
  {
    id: "svitPlus16000",
    name: "SVIT PLUS 16000",
    href: routes.products.svitPlus16000,
    type: "Батарея",
    // Source: /svit-plus-16000/ names use cases, not an audience.
    audience: "Сонячні станції та автономні системи",
    description: "Акумуляторна батарея LiFePO₄ для автономних систем",
    capacity: { value: 16.07, unit: "kWh" },
    specs: [
      { key: "capacity", value: { value: 16.07, unit: "kWh" } },
      { key: "chemistry", value: "LiFePO₄" },
    ],
    // TODO(content): фото
  },
  {
    id: "lithiumvalley",
    name: "LITHIUMVALLEY",
    href: routes.products.lithiumvalley,
    type: "BESS",
    audience: "Бізнес",
    description: "Промислові системи накопичення для підприємств",
    capacity: { value: 208, unit: "kWh", qualifier: "from" },
    specs: [
      { key: "minCapacity", value: { value: 208, unit: "kWh" } },
      { key: "maxCapacity", value: { value: 1044, unit: "kWh" } },
      { key: "type", value: "BESS" },
    ],
    featured: { segment: "Бізнес", tone: "dark" },
    // TODO(content): фото
  },
];

export const products = Object.fromEntries(
  productList.map((product) => [product.id, product]),
) as Record<ProductId, Product>;

/** One-line factual summaries for menus (built from specs, not hardcoded numbers). */
const q = formatQuantity;
export const productSummaries: Record<ProductId, string> = {
  svit600: `Станція ${q({ value: 600, unit: "W" })}, LiFePO₄ ${q(products.svit600.capacity)}`,
  svitHome: `Гібридний інвертор ${q({ value: 6, unit: "kW" })} і АКБ ${q(products.svitHome.capacity)}`,
  svitPlus5000: `LiFePO₄ ${q(products.svitPlus5000.capacity)}, потужність ${q({ value: 5, unit: "kW" })}`,
  svitPlus16000: `LiFePO₄ ${q(products.svitPlus16000.capacity)} для автономних систем`,
  lithiumvalley: `Промислове зберігання енергії від ${formatNumber(208)} до ${q({ value: 1044, unit: "kWh" })}`,
};
