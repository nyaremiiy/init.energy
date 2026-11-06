export type Office = {
  id: string;
  city: string;
  address: string;
  phone: {
    display: string;
    href: string;
  };
};

export type NavLink = {
  href: string;
  label: string;
};

export type NavMenuLink = NavLink & {
  description: string;
};

export type NavColumn = {
  title: string;
  items: NavMenuLink[];
};

export type NavGroup = {
  label: string;
  columns: NavColumn[];
};

export const navCta = {
  title: "Не знаєте, що обрати?",
  text: "Інженер INIT ENERGY підбере систему під ваше споживання та бюджет.",
  href: "#contacts",
  label: "Отримати розрахунок",
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "columns" in item;
}

export type Language = {
  code: string;
  label: string;
  href?: string;
};

export const offices: Office[] = [
  {
    id: "lviv",
    city: "Львів",
    address: "вул. Шевченка, 317б",
    phone: { display: "+38 067 198 55 50", href: "tel:+380671985550" },
  },
  {
    id: "kyiv",
    city: "Київ",
    address: "вул. Є. Сверстюка, 19",
    phone: { display: "+38 067 555 12 50", href: "tel:+380675551250" },
  },
];

export const contactEmail = "initenergy@gmail.com";

export type SocialNetwork = "facebook" | "instagram" | "linkedin" | "tiktok";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    network: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/init.energy",
  },
  {
    network: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/init.energy/",
  },
  {
    network: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/init-energy",
  },
  {
    network: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@init.energy",
  },
];

// URLs match the current init.energy site to preserve indexed pages.
export const navItems: NavItem[] = [
  {
    label: "SVIT",
    columns: [
      {
        title: "Резервне живлення",
        items: [
          {
            href: "/svit-home/",
            label: "SVIT HOME",
            description: "Гібридний інвертор 6 кВт і АКБ 5,12 кВт·год",
          },
          {
            href: "/svit-600/",
            label: "SVIT 600",
            description: "Станція 600 Вт, LiFePO₄ 865 Вт·год",
          },
        ],
      },
      {
        title: "Акумулятори",
        items: [
          {
            href: "/svit-plus-5000/",
            label: "SVIT PLUS 5000",
            description: "LiFePO₄ 5,12 кВт·год, потужність 5 кВт",
          },
          {
            href: "/svit-plus-16000/",
            label: "SVIT PLUS 16000",
            description: "LiFePO₄ 16,07 кВт·год для автономних систем",
          },
        ],
      },
      {
        title: "Для бізнесу",
        items: [
          {
            href: "/bess/",
            label: "LITHIUMVALLEY",
            description: "Промислове зберігання енергії від 208 до 1 044 кВт·год",
          },
        ],
      },
    ],
  },
  {
    label: "Рішення",
    columns: [
      {
        title: "Сонячні електростанції",
        items: [
          {
            href: "/cec/",
            label: "СЕС під ключ",
            description: "Проєктування та монтаж для бізнесу й приватних об'єктів",
          },
        ],
      },
      {
        title: "Галузеві рішення",
        items: [
          {
            href: "/rishennya/ses-dlya-gotelyu/",
            label: "СЕС для готелю та відпочинкового комплексу",
            description: "Енергонезалежність для готелів і баз відпочинку",
          },
        ],
      },
    ],
  },
  // Add links to home page sections (about, projects, contacts) as they are built.
];

// TODO: add `href` for other locales once i18n routing exists.
export const languages: Language[] = [
  { code: "uk", label: "UA", href: "/" },
  { code: "en", label: "EN" },
];

export const currentLanguage = "uk";

export const officeRotationInterval = 5000;
