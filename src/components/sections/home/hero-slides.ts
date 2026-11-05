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

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-title",
    image: generalHeroImage,
    label: "Енергетична незалежність для дому та бізнесу",
    heading: "Енергетична незалежність",
    headingLevel: "h1",
    description:
      "Проєктуємо та встановлюємо сонячні електростанції, сонячні панелі й системи резервного живлення для приватних будинків, квартир і підприємств.",
    actions: [
      {
        href: "#contact",
        label: "Підібрати рішення",
        variant: "primary",
      },
      {
        href: "#solar-stations",
        label: "Сонячні електростанції",
        variant: "secondary",
      },
    ],
  },
  {
    id: "solar-stations-title",
    image: solarHeroImage,
    label: "Сонячні електростанції під ключ",
    heading: "Сонячні електростанції",
    headingLevel: "h2",
    description:
      "Виконуємо проєктування, монтаж і підключення сонячних панелей та обладнання для СЕС — від розрахунку потужності до запуску станції.",
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
    image: backupPowerHeroImage,
    label: "Резервне живлення для дому та бізнесу",
    heading: "Резервне живлення",
    headingLevel: "h2",
    description:
      "Розробляємо та встановлюємо системи резервного живлення й готові комплекси на 300 Вт, 5 кВт, 16 кВт і до 1 044 кВт для квартир, будинків, бізнесу та критичної інфраструктури.",
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
