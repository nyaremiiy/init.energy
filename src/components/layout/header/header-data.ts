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

export type NavGroup = {
  label: string;
  items: NavLink[];
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "items" in item;
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
    items: [
      { href: "/svit-600/", label: "SVIT 600" },
      { href: "/svit-plus-5000/", label: "SVIT PLUS 5000" },
      { href: "/svit-plus-16000/", label: "SVIT PLUS 16000" },
      { href: "/svit-home/", label: "SVIT HOME" },
      { href: "/bess/", label: "LITHIUMVALLEY" },
    ],
  },
  {
    label: "Рішення",
    items: [
      { href: "/cec/", label: "СЕС під ключ" },
      {
        href: "/rishennya/ses-dlya-gotelyu/",
        label: "СЕС для готелю та відпочинкового комплексу",
      },
    ],
  },
  { href: "#about-us", label: "Про нас" },
  { href: "#projects", label: "Проєкти" },
  { href: "#contacts", label: "Контакти" },
];

// TODO: add `href` for other locales once i18n routing exists.
export const languages: Language[] = [
  { code: "uk", label: "UA", href: "/" },
  { code: "en", label: "EN" },
];

export const currentLanguage = "uk";

export const officeRotationInterval = 5000;
