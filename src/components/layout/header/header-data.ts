import { products, productSummaries, type ProductId } from "@/content/products";
import { routes } from "@/content/routes";
import { services, type ServiceId } from "@/content/services";

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
  href: routes.sections.contacts,
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

const productLink = (id: ProductId): NavMenuLink => ({
  href: products[id].href,
  label: products[id].name,
  description: productSummaries[id],
});

const serviceLink = (id: ServiceId): NavMenuLink => ({
  href: services[id].href,
  label: services[id].name,
  description: services[id].summary,
});

export const navItems: NavItem[] = [
  {
    label: "SVIT",
    columns: [
      {
        title: "Резервне живлення",
        items: [productLink("svitHome"), productLink("svit600")],
      },
      {
        title: "Акумулятори",
        items: [productLink("svitPlus5000"), productLink("svitPlus16000")],
      },
      {
        title: "Для бізнесу",
        items: [productLink("lithiumvalley")],
      },
    ],
  },
  {
    label: "Рішення",
    columns: [
      {
        title: "Сонячні електростанції",
        items: [serviceLink("turnkeySes")],
      },
      {
        title: "Галузеві рішення",
        items: [serviceLink("hotelSes")],
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
