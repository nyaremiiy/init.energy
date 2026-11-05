export type HeroSlide = {
  id: string;
  image: HeroImage;
  label: string;
  heading: string;
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
  mobile?: string;
  tablet?: string;
  type?: "image/avif";
};

const existingHeroImage: HeroImage = {
  desktop: "/images/home/hero/w2560.avif",
  fallback: "/images/home/hero/w2560.webp",
  mobile: "/images/home/hero/w750.avif",
  tablet: "/images/home/hero/w1280.avif",
  type: "image/avif",
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-title",
    image: {
      desktop: "/images/home/hero/main-2560.jpeg",
      fallback: "/images/home/hero/main-2560.jpeg",
    },
    label: "Твоя енергетична незалежність",
    heading: "Комплексні енергетичні рішення",
    headingLevel: "h1",
    description:
      "Проєктуємо та встановлюємо сонячні електростанції, панелі й системи резервного живлення — від інженерного рішення до запуску та сервісу.",
    actions: [
      {
        href: "#contact",
        label: "Підібрати рішення",
        variant: "primary",
      },
      {
        href: "#solar-stations",
        label: "Сонячні станції",
        variant: "secondary",
      },
    ],
  },
  {
    id: "solar-stations-title",
    image: existingHeroImage,
    label: "Сонячна енергія під ключ",
    heading: "Встановлюємо сонячні електростанції",
    headingLevel: "h2",
    description:
      "Проєктуємо станцію під ваше споживання, монтуємо сонячні панелі, підключаємо обладнання та запускаємо готову систему під ключ.",
    actions: [
      {
        href: "#contact",
        label: "Залишити заявку",
        variant: "primary",
      },
      {
        href: "#calculator",
        label: "Розрахувати вартість",
        variant: "secondary",
      },
    ],
  },
  {
    id: "backup-power-title",
    image: existingHeroImage,
    label: "Резервне живлення під ключ",
    heading: "Системи резервного живлення",
    headingLevel: "h2",
    description:
      "Розробляємо та встановлюємо готові комплекси на 300 Вт, 5 кВт і 16 кВт, а також масштабовані системи до 1 044 кВт для дому, бізнесу й критичної інфраструктури.",
    actions: [
      {
        href: "#contact",
        label: "Підібрати рішення",
        variant: "primary",
      },
      {
        href: "#contact",
        label: "Залишити заявку",
        variant: "secondary",
      },
    ],
  },
];
