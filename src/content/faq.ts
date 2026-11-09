import type { Locale } from "@/lib/format";

export type FaqTopic = "backup" | "solar" | "products" | "warranty";

/** Pages where an entry is shown; the home page shows all of them. */
export type FaqPage = "home" | "solar" | "backup" | "products";

export type Faq = {
  id: string;
  topic: FaqTopic;
  pages: FaqPage[];
  /** The first sentence of every answer is a direct answer (GEO). */
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
};

export const faqTopics: FaqTopic[] = [
  "backup",
  "solar",
  "products",
  "warranty",
];

/**
 * Facts checked against content/products.ts and content/company.ts (2026-11-09).
 * SVIT 600 battery chemistry is not stated: init.energy contradicts itself
 * (Li-ion in the table, LiFePO₄ in the text).
 */
export const faqList: Faq[] = [
  {
    id: "svit-home-runtime",
    topic: "backup",
    pages: ["home", "backup", "products"],
    question: {
      uk: "Скільки працюватиме будинок від SVIT HOME під час відключення?",
      en: "How long will a house run on SVIT HOME during an outage?",
    },
    answer: {
      uk: "Залежить від навантаження. SVIT HOME має ємність 5,12 кВт·год: якщо одночасно працюють котел, холодильник, світло й роутер — приблизно 0,5 кВт, — заряду вистачить на 9–10 годин. Точний час для вашого будинку покаже калькулятор вище.",
      en: "It depends on the load. SVIT HOME stores 5.12 kWh: with a boiler, fridge, lights and router running together — about 0.5 kW — a full charge lasts 9–10 hours. The calculator above shows the exact time for your house.",
    },
  },
  {
    id: "apartment-backup",
    topic: "backup",
    pages: ["home", "backup", "products"],
    question: {
      uk: "Чи можна поставити резервне живлення в квартирі?",
      en: "Can I have backup power in an apartment?",
    },
    answer: {
      uk: "Так. Для квартири підходить портативна станція SVIT 600: 865 Вт·год і потужність 600 Вт. Вона заряджається від звичайної розетки й не потребує монтажу — роутер, світло, ноутбук і телефони працюватимуть під час відключень.",
      en: "Yes. The SVIT 600 portable station suits an apartment: 865 Wh and 600 W of power. It charges from a regular socket and needs no installation — your router, lights, laptop and phones keep working during outages.",
    },
  },
  {
    id: "lifepo4",
    topic: "products",
    pages: ["home", "products"],
    question: {
      uk: "Чим батареї LiFePO₄ кращі за інші?",
      en: "Why are LiFePO₄ batteries better than others?",
    },
    answer: {
      uk: "LiFePO₄ (літій-залізо-фосфат) стабільніші при нагріванні й витримують значно більше циклів заряду, ніж свинцево-кислотні батареї. Батарея SVIT HOME розрахована на 6 000+ циклів.",
      en: "LiFePO₄ (lithium iron phosphate) cells stay stable when they heat up and last far more charge cycles than lead-acid batteries. The SVIT HOME battery is rated for 6,000+ cycles.",
    },
  },
  {
    id: "solar-sizing",
    topic: "solar",
    pages: ["home", "solar"],
    question: {
      uk: "Як підібрати потужність сонячної електростанції?",
      en: "How do I choose the size of a solar power plant?",
    },
    answer: {
      uk: "Потужність рахують від річного споживання і регіону: від області залежить, скільки енергії дасть 1 кВт панелей. Попередню цифру покаже калькулятор, а точну конфігурацію інженер INIT ENERGY підтвердить після розмови.",
      en: "The size follows from your annual consumption and region: the oblast sets how much energy 1 kW of panels produces. The calculator gives a first estimate, and an INIT ENERGY engineer confirms the exact configuration after a call.",
    },
  },
  {
    id: "backup-then-solar",
    topic: "solar",
    pages: ["home", "solar", "backup"],
    question: {
      uk: "Чи можна почати з резервного живлення, а панелі додати пізніше?",
      en: "Can I start with backup power and add panels later?",
    },
    answer: {
      uk: "Так. Якщо плануєте СЕС, скажіть про це інженеру одразу — він підбере обладнання, до якого пізніше можна буде підключити сонячні панелі.",
      en: "Yes. If you plan a solar plant, tell the engineer up front — they will choose equipment that solar panels can be connected to later.",
    },
  },
  {
    id: "warranty",
    topic: "warranty",
    pages: ["home", "products"],
    question: {
      uk: "Яка гарантія на обладнання?",
      en: "What warranty does the equipment have?",
    },
    answer: {
      uk: "На батарею SVIT PLUS 5000 — 5 років гарантії з можливістю продовження, на промислові системи LITHIUMVALLEY — 10 років від виробника. Умови для інших моделей уточнюйте в інженера.",
      en: "The SVIT PLUS 5000 battery has a 5-year warranty that can be extended, and LITHIUMVALLEY industrial systems have a 10-year manufacturer warranty. Ask an engineer about other models.",
    },
  },
  {
    id: "coverage",
    topic: "warranty",
    pages: ["home"],
    question: {
      uk: "Ви працюєте лише у Львові й Києві?",
      en: "Do you only work in Lviv and Kyiv?",
    },
    answer: {
      uk: "Ні. Офіси INIT ENERGY у Львові та Києві, а проєкти СЕС і резервного живлення виконуємо по всій Україні.",
      en: "No. INIT ENERGY has offices in Lviv and Kyiv, and builds solar and backup power projects across Ukraine.",
    },
  },
  {
    id: "turnkey-price",
    topic: "warranty",
    pages: ["home", "solar", "backup"],
    question: {
      uk: "Скільки коштує система під ключ?",
      en: "How much does a turnkey system cost?",
    },
    answer: {
      uk: "Вартість залежить від споживання, потрібних годин резерву і потужності СЕС. Залиште заявку — інженер підбере конфігурацію і назве вартість обладнання, монтажу й запуску однією сумою.",
      en: "The price depends on your consumption, the hours of backup you need and the solar plant size. Leave a request — an engineer will choose the configuration and quote equipment, installation and commissioning as one sum.",
    },
  },
];

export function faqForPage(page: FaqPage): Faq[] {
  return faqList.filter((faq) => faq.pages.includes(page));
}
