export type Office = {
  id: string;
  city: string;
  address: string;
  phone: {
    display: string;
    href: string;
  };
};

export type NavItem = {
  href: string;
  label: string;
};

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

export const navItems: NavItem[] = [
  { href: "#solar-stations", label: "Сонячні електростанції" },
  { href: "#backup-power", label: "Резервне живлення" },
  { href: "#calculator", label: "Калькулятор" },
  { href: "#contact", label: "Контакти" },
];

// TODO: add `href` for other locales once i18n routing exists.
export const languages: Language[] = [
  { code: "uk", label: "UA", href: "/" },
  { code: "en", label: "EN" },
];

export const currentLanguage = "uk";

export const officeRotationInterval = 5000;
