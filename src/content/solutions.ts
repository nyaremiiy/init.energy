import { products, type ProductId } from "./products";
import { routes } from "./routes";

export type SolutionLink = {
  label: string;
  href: string;
};

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
  links: SolutionLink[];
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
    links: [
      {
        label: "Резервне живлення для квартири",
        href: routes.backupPower.apartment,
      },
    ],
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
      {
        label: "Резервне живлення для будинку",
        href: routes.backupPower.house,
      },
      { label: "СЕС для дому", href: routes.ses.home },
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
      {
        label: "Резервне живлення для бізнесу",
        href: routes.backupPower.business,
      },
      { label: "СЕС для бізнесу", href: routes.ses.business },
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
