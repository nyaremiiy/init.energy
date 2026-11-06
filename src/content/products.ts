import { routes } from "./routes";

// Source: product pages on https://init.energy (checked 2026-11-06).
export type ProductId =
  | "svit600"
  | "svitPlus5000"
  | "svitPlus16000"
  | "svitHome"
  | "lithiumvalley";

export type Product = {
  id: ProductId;
  name: string;
  href: string;
  /** Key spec shown in cards (capacity). */
  capacity: string;
  /** One-line factual summary for menus and lists. */
  summary: string;
};

export const products: Record<ProductId, Product> = {
  svit600: {
    id: "svit600",
    name: "SVIT 600",
    href: routes.products.svit600,
    capacity: "865 Вт·год",
    summary: "Станція 600 Вт, LiFePO₄ 865 Вт·год",
  },
  svitPlus5000: {
    id: "svitPlus5000",
    name: "SVIT PLUS 5000",
    href: routes.products.svitPlus5000,
    capacity: "5,12 кВт·год",
    summary: "LiFePO₄ 5,12 кВт·год, потужність 5 кВт",
  },
  svitPlus16000: {
    id: "svitPlus16000",
    name: "SVIT PLUS 16000",
    href: routes.products.svitPlus16000,
    capacity: "16,07 кВт·год",
    summary: "LiFePO₄ 16,07 кВт·год для автономних систем",
  },
  svitHome: {
    id: "svitHome",
    name: "SVIT HOME",
    href: routes.products.svitHome,
    capacity: "5,12 кВт·год",
    summary: "Гібридний інвертор 6 кВт і АКБ 5,12 кВт·год",
  },
  lithiumvalley: {
    id: "lithiumvalley",
    name: "LITHIUMVALLEY",
    href: routes.products.lithiumvalley,
    capacity: "від 208 кВт·год",
    summary: "Промислове зберігання енергії від 208 до 1 044 кВт·год",
  },
};
