import type { Localized } from "@/i18n/config";

import { productList } from "./products";

// Every claim below is sourced from https://init.energy (checked 2026-11-06);
// the quotes are kept next to each value. English is a translation of the same facts.

export type Office = {
  id: string;
  city: Localized;
  address: Localized;
  phone: {
    display: string;
    href: string;
  };
  mapHref: string;
};

export const offices: Office[] = [
  {
    id: "lviv",
    city: { uk: "Львів", en: "Lviv" },
    // TODO(content): verify the official English spelling of the address.
    address: { uk: "вул. Шевченка, 317б", en: "317b Shevchenka St." },
    phone: { display: "+380671985550", href: "tel:+380671985550" },
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Львів%2C%20вул.%20Шевченка%2C%20317б",
  },
  {
    id: "kyiv",
    city: { uk: "Київ", en: "Kyiv" },
    address: { uk: "вул. Є.Сверстюка, 19", en: "19 Ye. Sverstiuka St." },
    phone: { display: "+380675551250", href: "tel:+380675551250" },
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Київ%2C%20вул.%20Є.%20Сверстюка%2C%2019",
  },
];

export const companyContacts = {
  email: {
    display: "initenergy@gmail.com",
    href: "mailto:initenergy@gmail.com",
  },
} as const;

export const serviceArea: Localized = { uk: "Україна", en: "Ukraine" };

export type TrustStat = {
  id: "years" | "projects" | "installedPower" | "svitModels";
  value: Localized;
  label: Localized;
};

export type TrustArgument = {
  id: string;
  title: Localized;
  description: Localized;
};

export type TrustContent = {
  stats: TrustStat[];
  arguments: TrustArgument[];
  image?: { src: string; alt: Localized; width: number; height: number };
};

export const trust: TrustContent = {
  stats: [
    // «INIT ENERGY — напрямок компанії «Інформація і технології», яка понад 30 років працює в енергетиці…»
    {
      id: "years",
      value: { uk: "30+", en: "30+" },
      label: {
        uk: "років досвіду в енергетиці",
        en: "years in the energy sector",
      },
    },
    // «20+ Реалізованих проєктів»
    {
      id: "projects",
      value: { uk: "20+", en: "20+" },
      label: { uk: "реалізованих проєктів", en: "completed projects" },
    },
    // «1 МВт+ Встановленої потужності»
    {
      id: "installedPower",
      value: { uk: "1 МВт+", en: "1 MW+" },
      label: { uk: "встановленої потужності", en: "of installed capacity" },
    },
    {
      id: "svitModels",
      value: {
        uk: String(productList.filter((p) => p.brand === "SVIT").length),
        en: String(productList.filter((p) => p.brand === "SVIT").length),
      },
      label: { uk: "моделей накопичувачів SVIT", en: "SVIT battery models" },
    },
  ],
  arguments: [
    {
      id: "team",
      title: {
        uk: "Власне обладнання та інженерна команда",
        en: "Our own equipment and engineering team",
      },
      // «Власне обладнання, інженерна команда та будівельники з практичним досвідом у сонячній енергетиці.»
      // «Інженери та монтажники з багаторічним досвідом реалізації складних проєктів будь-якої масштабності.»
      description: {
        uk: "Інженери та монтажники з багаторічним досвідом реалізують проєкти будь-якої масштабності — від квартири до підприємства.",
        en: "Engineers and installers with years of experience deliver projects of any scale — from an apartment to an industrial site.",
      },
    },
    {
      id: "turnkey",
      title: {
        uk: "Під ключ: розрахунок → монтаж → підтримка",
        en: "Turnkey: sizing → installation → support",
      },
      // «Будуємо «під ключ»» · «Оперативна технічна підтримка 24/7.»
      description: {
        uk: "Одна команда рахує споживання, проєктує й монтує систему, а після запуску — оперативна технічна підтримка 24/7.",
        en: "One team calculates consumption, designs and installs the system, and provides 24/7 technical support after launch.",
      },
    },
    {
      id: "warranty",
      title: { uk: "Офіційна гарантія", en: "Official warranty" },
      // «Офіційна гарантія на обладнання та роботи.»
      // /svit-home/: «5 років офіційної гарантії з можливістю продовження» (SVIT Plus 5000).
      // /bess/: «Надається 10 років офіційної гарантії на батарейну систему від виробника.»
      description: {
        uk: "Гарантія на обладнання та роботи: 5 років на батарею SVIT PLUS 5000 з можливістю продовження, 10 років від виробника — на LITHIUMVALLEY.",
        en: "Warranty on equipment and work: 5 years on the SVIT PLUS 5000 battery, extendable, and a 10-year manufacturer warranty on LITHIUMVALLEY.",
      },
    },
  ],
  image: {
    src: "/images/home/solar.avif",
    alt: {
      uk: "Монтажники в касках встановлюють сонячні панелі на даху будинку",
      en: "Installers in hard hats mounting solar panels on a house roof",
    },
    width: 6016,
    height: 4016,
  },
};
