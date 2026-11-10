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

export const heroSlideCount = slides.length;

/** Slides with texts and links for one locale. */
export function getHeroSlides(locale: Locale): HeroSlide[] {
  return slides.map((slide) => ({
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
