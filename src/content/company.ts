import { productList } from "./products";

// Every claim below is sourced from https://init.energy (checked 2026-11-06);
// the quotes are kept next to each value. Ukrainian only for now.

export type Office = {
  id: string;
  city: string;
  address: string;
  phone: {
    display: string;
    href: string;
  };
  mapHref: string;
};

export const offices: Office[] = [
  {
    id: "lviv",
    city: "Львів",
    address: "вул. Шевченка, 317б",
    phone: { display: "+38 067 198 55 50", href: "tel:+380671985550" },
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Львів%2C%20вул.%20Шевченка%2C%20317б",
  },
  {
    id: "kyiv",
    city: "Київ",
    address: "вул. Є. Сверстюка, 19",
    phone: { display: "+38 067 555 12 50", href: "tel:+380675551250" },
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Київ%2C%20вул.%20Є.%20Сверстюка%2C%2019",
  },
];

export const companyContacts = {
  email: {
    display: "initenergy@gmail.com",
    href: "mailto:initenergy@gmail.com",
  },
  primaryOffice: offices[0],
} as const;

export type TrustStat = {
  id: "years" | "projects" | "installedPower" | "svitModels";
  value: string;
  label: string;
};

export type TrustArgument = {
  id: string;
  title: string;
  description: string;
};

export type TrustContent = {
  stats: TrustStat[];
  arguments: TrustArgument[];
  image?: { src: string; alt: string; width: number; height: number };
};

export const trust: TrustContent = {
  stats: [
    // «INIT ENERGY — напрямок компанії «Інформація і технології», яка понад 30 років працює в енергетиці…»
    { id: "years", value: "30+", label: "років досвіду в енергетиці" },
    // «20+ Реалізованих проєктів»
    { id: "projects", value: "20+", label: "реалізованих проєктів" },
    // «1 МВт+ Встановленої потужності»
    { id: "installedPower", value: "1 МВт+", label: "встановленої потужності" },
    {
      id: "svitModels",
      value: String(productList.filter((p) => p.brand === "SVIT").length),
      label: "моделей накопичувачів SVIT",
    },
  ],
  arguments: [
    {
      id: "team",
      title: "Власне обладнання та інженерна команда",
      // «Власне обладнання, інженерна команда та будівельники з практичним досвідом у сонячній енергетиці.»
      // «Інженери та монтажники з багаторічним досвідом реалізації складних проєктів будь-якої масштабності.»
      description:
        "Інженери та монтажники з багаторічним досвідом реалізують проєкти будь-якої масштабності — від квартири до підприємства.",
    },
    {
      id: "turnkey",
      title: "Під ключ: розрахунок → монтаж → підтримка",
      // «Будуємо «під ключ»» · «Оперативна технічна підтримка 24/7.»
      description:
        "Одна команда рахує споживання, проєктує й монтує систему, а після запуску — оперативна технічна підтримка 24/7.",
    },
    {
      id: "warranty",
      title: "Офіційна гарантія",
      // «Офіційна гарантія на обладнання та роботи.»
      // /svit-home/: «5 років офіційної гарантії з можливістю продовження» (SVIT Plus 5000).
      // /bess/: «Надається 10 років офіційної гарантії на батарейну систему від виробника.»
      description:
        "Гарантія на обладнання та роботи: 5 років на батарею SVIT PLUS 5000 з можливістю продовження, 10 років від виробника — на LITHIUMVALLEY.",
    },
  ],
  image: {
    src: "/images/home/solar.avif",
    alt: "Монтажники в касках встановлюють сонячні панелі на даху будинку",
    width: 6016,
    height: 4016,
  },
};
