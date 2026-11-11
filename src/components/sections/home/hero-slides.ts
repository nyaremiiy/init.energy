import type { Locale, Localized } from "@/i18n/config";
import { anchors, routes, sectionHref } from "@/content/routes";

export type HeroSlide = {
  id: string;
  image: HeroImage;
  label: string;
  heading: [string, string];
  headingLevel: "h1" | "h2";
  description: string;
  actions: Array<{
    href: string;
    label: string;
    variant: "primary" | "secondary";
  }>;
};

type HeroImage = {
  desktop: string;
  fallback: string;
  laptop?: string;
  mobile?: string;
  position?: "center" | "top";
  tablet?: string;
  type?: "image/avif";
};

const generalHeroImage: HeroImage = {
  desktop: "/images/home/hero/01-2560.avif",
  fallback: "/images/home/hero/01-2560.avif",
  laptop: "/images/home/hero/01-1920.avif",
  mobile: "/images/home/hero/01-750.avif",
  tablet: "/images/home/hero/01-1280.avif",
  type: "image/avif",
};

const solarHeroImage: HeroImage = {
  desktop: "/images/home/hero/02-2560.avif",
  fallback: "/images/home/hero/02-2560.webp",
  laptop: "/images/home/hero/02-1920.avif",
  mobile: "/images/home/hero/02-750.avif",
  tablet: "/images/home/hero/02-1280.avif",
  type: "image/avif",
};

const backupPowerHeroImage: HeroImage = {
  desktop: "/images/home/hero/03-2560.avif",
  fallback: "/images/home/hero/03-2560.avif",
  laptop: "/images/home/hero/03-1920.avif",
  mobile: "/images/home/hero/03-750.avif",
  position: "top",
  tablet: "/images/home/hero/03-1280.avif",
  type: "image/avif",
};

/** Dedicated responsive media for the solar plant hub (/cec/). */
const sesOverviewHeroImage: HeroImage = {
  desktop: "/images/cec/hero/01-2560.avif",
  fallback: "/images/cec/hero/01-2560.webp",
  laptop: "/images/cec/hero/01-1920.avif",
  mobile: "/images/cec/hero/01-750.avif",
  tablet: "/images/cec/hero/01-1280.avif",
  type: "image/avif",
};

const sesStorageHeroImage: HeroImage = {
  desktop: "/images/cec/hero/02-2560.avif",
  fallback: "/images/cec/hero/02-2560.avif",
  laptop: "/images/cec/hero/02-1920.avif",
  mobile: "/images/cec/hero/02-750.avif",
  tablet: "/images/cec/hero/02-1280.avif",
  type: "image/avif",
};

const sesHybridHeroImage: HeroImage = {
  desktop: "/images/cec/hero/03-2560.avif",
  fallback: "/images/cec/hero/03-2560.avif",
  laptop: "/images/cec/hero/03-1920.avif",
  mobile: "/images/cec/hero/03-750.avif",
  tablet: "/images/cec/hero/03-1280.avif",
  type: "image/avif",
};

type SlideSource = {
  id: string;
  image: HeroImage;
  label: Localized;
  heading: Record<Locale, [string, string]>;
  headingLevel: "h1" | "h2";
  description: Localized;
  actions: Array<{
    /** A home section (localized) or a page that exists in Ukrainian only. */
    target: { anchor: string } | { href: string };
    label: Localized;
    variant: "primary" | "secondary";
  }>;
};

const slides: SlideSource[] = [
  {
    id: "hero-title",
    image: generalHeroImage,
    label: {
      uk: "INIT ENERGY — енергетична незалежність",
      en: "INIT ENERGY — energy independence",
    },
    heading: {
      uk: ["Сонячні станції", "і резервне живлення"],
      en: ["Solar power plants", "and backup power"],
    },
    headingLevel: "h1",
    description: {
      uk: "INIT ENERGY проєктує та встановлює сонячні електростанції (СЕС) і системи резервного живлення для приватних будинків, квартир і підприємств — від розрахунку споживання й підбору обладнання до монтажу та запуску.",
      en: "INIT ENERGY designs and installs solar power plants and backup power systems for private houses, apartments and businesses in Ukraine — from sizing consumption and choosing equipment to installation and commissioning.",
    },
    actions: [
      {
        target: { anchor: anchors.contacts },
        label: { uk: "Підібрати рішення", en: "Find a solution" },
        variant: "primary",
      },
      {
        target: { href: routes.services.turnkeySes },
        label: { uk: "Сонячні електростанції", en: "Solar power plants" },
        variant: "secondary",
      },
    ],
  },
  {
    id: "solar-stations-title",
    image: solarHeroImage,
    label: {
      uk: "Сонячні електростанції під ключ",
      en: "Turnkey solar power plants",
    },
    heading: {
      uk: ["СЕС під ключ", "для дому й бізнесу"],
      en: ["Turnkey solar", "for homes and businesses"],
    },
    headingLevel: "h2",
    description: {
      uk: "Сонячна електростанція під ключ: розрахунок потужності під ваше споживання, проєкт, монтаж сонячних панелей, інвертора й акумуляторів, підключення та запуск станції.",
      en: "A turnkey solar power plant: sizing for your consumption, design, installation of solar panels, the inverter and batteries, connection and commissioning.",
    },
    actions: [
      {
        target: { anchor: anchors.contacts },
        label: { uk: "Залишити заявку", en: "Leave a request" },
        variant: "primary",
      },
      {
        target: { anchor: anchors.contacts },
        label: { uk: "Розрахувати вартість", en: "Estimate the cost" },
        variant: "secondary",
      },
    ],
  },
  {
    id: "backup-power-title",
    image: backupPowerHeroImage,
    label: {
      uk: "Резервне живлення для дому та бізнесу",
      en: "Backup power for homes and businesses",
    },
    heading: {
      uk: ["Резервне живлення", "під час блекаутів"],
      en: ["Backup power", "during blackouts"],
    },
    headingLevel: "h2",
    description: {
      uk: "Системи резервного живлення та готові комплекси потужністю 300 Вт, 5 кВт, 16 кВт і до 1 044 кВт на базі інверторів і акумуляторів (АКБ) — для квартир, приватних будинків, бізнесу та критичної інфраструктури.",
      en: "Backup power systems and ready kits of 300 W, 5 kW, 16 kW and up to 1,044 kW built on inverters and batteries — for apartments, private houses, businesses and critical infrastructure.",
    },
    actions: [
      {
        target: { anchor: anchors.contacts },
        label: { uk: "Підібрати рішення", en: "Find a solution" },
        variant: "primary",
      },
      {
        target: { anchor: anchors.contacts },
        label: { uk: "Залишити заявку", en: "Leave a request" },
        variant: "secondary",
      },
    ],
  },
];

const sesSlides: SlideSource[] = [
  {
    id: "ses-title",
    image: sesOverviewHeroImage,
    label: {
      uk: "INIT ENERGY — сонячні електростанції",
      en: "INIT ENERGY — solar power plants",
    },
    heading: {
      uk: ["Сонячні електростанції", "під ключ"],
      en: ["Solar power plants", "turnkey"],
    },
    headingLevel: "h1",
    description: {
      uk: "Проєктуємо й встановлюємо СЕС для дому й бізнесу: від розрахунку споживання до запуску й сервісу. Накопичувачі SVIT — власного виробництва.",
      en: "We design and install solar power plants for homes and businesses: from consumption estimate to commissioning and service. SVIT batteries are made in-house.",
    },
    actions: [
      {
        target: { href: "#calculator" },
        label: { uk: "Розрахувати СЕС", en: "Calculate a plant" },
        variant: "primary",
      },
      {
        target: { href: "#projects" },
        label: { uk: "Реалізовані проєкти", en: "Completed projects" },
        variant: "secondary",
      },
    ],
  },
  {
    id: "ses-storage",
    image: sesStorageHeroImage,
    label: { uk: "Накопичувачі SVIT", en: "SVIT batteries" },
    heading: {
      uk: ["Вдень — сонце,", "вночі — батарея"],
      en: ["Sun by day,", "battery by night"],
    },
    headingLevel: "h2",
    description: {
      uk: "Накопичувач SVIT запасає надлишки енергії з панелей і живить будинок, коли сонця немає або вимкнули світло.",
      en: "The SVIT battery stores surplus energy from the panels and powers the house when there is no sun or the power is off.",
    },
    actions: [
      {
        target: { href: "#products" },
        label: { uk: "Накопичувачі SVIT", en: "SVIT batteries" },
        variant: "primary",
      },
      {
        target: { href: "#contacts" },
        label: { uk: "Залишити заявку", en: "Leave a request" },
        variant: "secondary",
      },
    ],
  },
  {
    id: "ses-hybrid",
    image: sesHybridHeroImage,
    label: { uk: "Гібридна СЕС", en: "Hybrid plant" },
    heading: {
      uk: ["Незалежність", "від відключень"],
      en: ["Independence", "from outages"],
    },
    headingLevel: "h2",
    description: {
      uk: "Гібридна станція працює з мережею, панелями й батареєю одночасно. Під час відключень будинок не втрачає світла.",
      en: "A hybrid plant works with the grid, panels and battery at the same time. During outages the house keeps its power.",
    },
    actions: [
      {
        target: { href: "#contacts" },
        label: { uk: "Залишити заявку", en: "Leave a request" },
        variant: "primary",
      },
      {
        target: { href: "#ses-types" },
        label: { uk: "Типи СЕС", en: "Plant types" },
        variant: "secondary",
      },
    ],
  },
];

export const heroSlideCount = slides.length;

/** Hub page (/ses/) slides: their own texts, same images for now. */
export function getSesHeroSlides(locale: Locale): HeroSlide[] {
  return mapSlides(sesSlides, locale);
}

/** Slides with texts and links for one locale. */
export function getHeroSlides(locale: Locale): HeroSlide[] {
  return mapSlides(slides, locale);
}

function mapSlides(list: SlideSource[], locale: Locale): HeroSlide[] {
  return list.map((slide) => ({
    id: slide.id,
    image: slide.image,
    label: slide.label[locale],
    heading: slide.heading[locale],
    headingLevel: slide.headingLevel,
    description: slide.description[locale],
    actions: slide.actions.map((action) => ({
      href:
        "anchor" in action.target
          ? sectionHref(action.target.anchor, locale)
          : action.target.href,
      label: action.label[locale],
      variant: action.variant,
    })),
  }));
}
