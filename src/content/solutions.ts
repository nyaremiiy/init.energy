import { products, type ProductId } from "./products";
import { services, type ServiceId } from "./services";

export type SolutionLink = {
  label: string;
  /** Full name when `label` is shortened. */
  title?: string;
  href: string;
};

type LinkRef = { product: ProductId } | { service: ServiceId };

export type Solution = {
  id: "apartment" | "house" | "business";
  index: string;
  segment: string;
  title: string;
  description: string;
  /** Products shown in the card's product row. */
  productIds: ProductId[];
  /** Optional prefix before product names, e.g. "СЕС". */
  productPrefix?: string;
  /** Product whose capacity is shown as the key spec. */
  specProductId: ProductId;
  links: LinkRef[];
  tone: "light" | "dark";
};

// Ukrainian only for now; EN arrives with i18n routing.
export const solutions: Solution[] = [
  {
    id: "apartment",
    index: "01",
    segment: "Квартира",
    title: "Світло й зв'язок під час відключень",
    description:
      "Роутер, освітлення, ноутбук і телефони. Працює від розетки, без монтажу.",
    productIds: ["svit600"],
    specProductId: "svit600",
    links: [{ product: "svit600" }],
    tone: "light",
  },
  {
    id: "house",
    index: "02",
    segment: "Приватний будинок",
    title: "Весь будинок без перебоїв",
    description:
      "Котел, насос і холодильник під час відключень, а вдень — власна сонячна енергія.",
    productIds: ["svitHome"],
    specProductId: "svitHome",
    links: [
      { product: "svitHome" },
      { product: "svitPlus5000" },
      { service: "turnkeySes" },
    ],
    tone: "light",
  },
  {
    id: "business",
    index: "03",
    segment: "Бізнес",
    title: "Безперервна робота підприємства",
    description:
      "Виробництво, склад, готель чи критичний об'єкт: резерв і генерація під навантаження.",
    productIds: ["lithiumvalley"],
    productPrefix: "СЕС",
    specProductId: "lithiumvalley",
    links: [
      { product: "lithiumvalley" },
      { service: "turnkeySes" },
      { service: "hotelSes" },
    ],
    tone: "dark",
  },
];

export function getSolutionProduct(solution: Solution) {
  const names = solution.productIds.map((id) => products[id].name);

  return {
    name: [solution.productPrefix, ...names].filter(Boolean).join(" + "),
    spec: products[solution.specProductId].capacity,
  };
}

export function getSolutionLinks(solution: Solution): SolutionLink[] {
  return solution.links.map((ref) => {
    if ("product" in ref) {
      const product = products[ref.product];

      return { label: product.name, href: product.href };
    }

    const service = services[ref.service];

    return {
      label: service.shortName ?? service.name,
      title: service.shortName ? service.name : undefined,
      href: service.href,
    };
  });
}
