import type { Localized } from "@/i18n/config";

import type { ConsentCategory } from "@/lib/consent/consent";

/**
 * Cookie policy (/polityka-cookie/, /en/polityka-cookie/).
 * TODO(content): legal review of the whole text before launch.
 */
export const cookiePolicyUpdatedAt = "2026-11-11";

export type CookieRecord = {
  name: string;
  provider: string;
  category: ConsentCategory;
  purpose: Localized;
  lifetime: Localized;
};

/** Cookies the site sets or allows; analytics and ad ones only after consent. */
export const cookieList: CookieRecord[] = [
  {
    name: "init_consent",
    provider: "INIT ENERGY",
    category: "necessary",
    purpose: { uk: "Зберігає ваш вибір щодо cookie.", en: "Stores your cookie choice." },
    lifetime: { uk: "12 місяців", en: "12 months" },
  },
  {
    name: "init_tracking",
    provider: "INIT ENERGY",
    category: "marketing",
    purpose: {
      uk: "Зберігає мітки рекламної кампанії (UTM, gclid, fbclid, ttclid), щоб передати їх разом із заявкою.",
      en: "Keeps ad campaign tags (UTM, gclid, fbclid, ttclid) to send them with your request.",
    },
    lifetime: { uk: "90 днів", en: "90 days" },
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    category: "analytics",
    purpose: { uk: "Розрізняє відвідувачів для статистики.", en: "Distinguishes visitors for statistics." },
    lifetime: { uk: "2 роки", en: "2 years" },
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    category: "analytics",
    purpose: { uk: "Зберігає стан сеансу для статистики.", en: "Keeps the session state for statistics." },
    lifetime: { uk: "2 роки", en: "2 years" },
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    category: "analytics",
    purpose: { uk: "Розрізняє відвідувачів протягом доби.", en: "Distinguishes visitors within a day." },
    lifetime: { uk: "24 години", en: "24 hours" },
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    category: "marketing",
    purpose: { uk: "Пов’язує заявки з рекламними кліками.", en: "Links requests to ad clicks." },
    lifetime: { uk: "90 днів", en: "90 days" },
  },
  {
    name: "_fbp",
    provider: "Meta (Facebook, Instagram)",
    category: "marketing",
    purpose: { uk: "Показ і вимірювання реклами в Meta.", en: "Shows and measures Meta ads." },
    lifetime: { uk: "90 днів", en: "90 days" },
  },
  {
    name: "_ttp",
    provider: "TikTok",
    category: "marketing",
    purpose: { uk: "Показ і вимірювання реклами в TikTok.", en: "Shows and measures TikTok ads." },
    lifetime: { uk: "13 місяців", en: "13 months" },
  },
];

/** Text sections of the policy (one H2 each). */
export const cookiePolicyText = {
  title: { uk: "Політика cookie", en: "Cookie policy" },
  lead: {
    uk: "Які cookie використовує сайт init.energy, навіщо вони потрібні й як змінити свою згоду.",
    en: "Which cookies init.energy uses, what they are for and how to change your consent.",
  },
  whatTitle: { uk: "Що таке cookie", en: "What cookies are" },
  whatText: {
    uk: "Cookie — це невеликі файли, які сайт зберігає у вашому браузері. Вони допомагають сайту працювати, запам’ятовувати налаштування, а з вашої згоди — збирати статистику відвідувань і показувати релевантну рекламу.",
    en: "Cookies are small files a website stores in your browser. They keep the site working and remember settings, and, with your consent, collect visit statistics and show relevant ads.",
  },
  categoriesTitle: { uk: "Категорії cookie", en: "Cookie categories" },
  categoriesText: {
    uk: "Необхідні cookie працюють завжди. Аналітичні й маркетингові вмикаються лише після вашої згоди; до неї сайт не завантажує Google Analytics, Google Ads, Meta чи TikTok.",
    en: "Necessary cookies are always on. Analytics and marketing cookies are turned on only after your consent; until then the site loads no Google Analytics, Google Ads, Meta or TikTok tags.",
  },
  tableTitle: { uk: "Які cookie ми використовуємо", en: "Cookies we use" },
  statsTitle: { uk: "Статистика без cookie", en: "Statistics without cookies" },
  statsText: {
    uk: "Окремо сайт рахує кількість відвідувань і переглянуті сторінки без cookie: IP-адреса не зберігається, а відвідувача неможливо встановити. Якщо браузер передає сигнал «не відстежувати», візит не рахується.",
    en: "Separately, the site counts visits and viewed pages without cookies: IP addresses are not stored and visitors cannot be identified. If your browser sends a Do Not Track signal, the visit is not counted.",
  },
} satisfies Record<string, Localized>;
