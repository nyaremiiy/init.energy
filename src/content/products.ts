// Source: product pages on https://init.energy (checked 2026-11-06).
export type ProductId = "svit600" | "svitPlus5000" | "svitPlus16000" | "svitHome" | "lithiumvalley";

export type Product = {
  id: ProductId;
  name: string;
  slug: string;
  /** Energy capacity as shown to users. */
  capacity: string;
};

export const products: Record<ProductId, Product> = {
  svit600: {
    id: "svit600",
    name: "SVIT 600",
    slug: "svit-600",
    capacity: "865 Вт·год",
  },
  svitPlus5000: {
    id: "svitPlus5000",
    name: "SVIT PLUS 5000",
    slug: "svit-plus-5000",
    capacity: "5,12 кВт·год",
  },
  svitPlus16000: {
    id: "svitPlus16000",
    name: "SVIT PLUS 16000",
    slug: "svit-plus-16000",
    capacity: "16,07 кВт·год",
  },
  svitHome: {
    id: "svitHome",
    name: "SVIT HOME",
    slug: "svit-home",
    capacity: "5,12 кВт·год",
  },
  lithiumvalley: {
    id: "lithiumvalley",
    name: "LITHIUMVALLEY",
    slug: "bess",
    capacity: "від 208 кВт·год",
  },
};
