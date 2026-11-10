import type { Locale } from "@/lib/format";

import type { ProductPageSlug } from "./product-pages";

export type FaqTopic = "backup" | "solar" | "products" | "warranty";

/** Pages where an entry is shown; the home page shows all of them. */
/** Product pages use their slug. */
export type FaqPage =
  "home" | "solar" | "backup" | "products" | ProductPageSlug;

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
    pages: ["home", "backup", "products", "svit-home"],
    question: {
      uk: "Скільки працюватиме будинок від SVIT HOME під час відключення?",
      en: "How long will a house run on SVIT HOME during an outage?",
    },
    answer: {
      uk: "Залежить від навантаження. SVIT HOME має ємність 5,12 кВт·год: якщо одночасно працюють котел, холодильник, світло й роутер — приблизно 0,5 кВт, — заряду вистачить на 9–10 годин. Точний час під ваше навантаження розрахує інженер INIT ENERGY.",
      en: "It depends on the load. SVIT HOME stores 5.12 kWh: with a boiler, fridge, lights and router running together — about 0.5 kW — a full charge lasts 9–10 hours. An INIT ENERGY engineer will calculate the exact time for your load.",
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
      uk: "LiFePO₄ (літій-залізо-фосфат) стабільніші при нагріванні й витримують значно більше циклів заряду, ніж свинцево-кислотні батареї. Батарея SVIT HOME розрахована понад на 10 000 циклів заряду й розряду.",
      en: "LiFePO₄ (lithium iron phosphate) cells stay stable when they heat up and last far more charge cycles than lead-acid batteries. The SVIT HOME battery is rated for over 10,000 charge and discharge cycles.",
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
  {
    id: "svit-plus-5000-lifetime",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Скільки прослужить SVIT PLUS 5000?",
      en: "How long does SVIT PLUS 5000 last?",
    },
    answer: {
      uk: "Батарея витримує понад 10 000 циклів заряду й розряду.",
      en: "The battery withstands over 10,000 charge and discharge cycles.",
    },
  },
  {
    id: "svit-plus-5000-safety",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Чи безпечна батарея?",
      en: "Is the battery safe?",
    },
    answer: {
      uk: "Так. Хімія LiFePO₄ стабільна при нагріванні, а батарея має захист від перегріву й перевантаження.",
      en: "Yes. LiFePO₄ chemistry stays stable when heated, and the battery is protected against overheating and overload.",
    },
  },
  {
    id: "svit-plus-5000-parallel",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Скільки батарей можна підключити паралельно?",
      en: "How many batteries can be connected in parallel?",
    },
    answer: {
      uk: "До 16 модулів, сумарно до 81 кВт·год. Конфігурацію під ваш інвертор підбере інженер.",
      en: "Up to 16 modules, up to 81 kWh in total. An engineer will choose the configuration for your inverter.",
    },
  },
  {
    id: "svit-plus-5000-warranty",
    topic: "warranty",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Яка гарантія?",
      en: "What is the warranty?",
    },
    answer: {
      uk: "5 років офіційної гарантії з можливістю продовження.",
      en: "A 5-year official warranty that can be extended.",
    },
  },
  {
    id: "svit-plus-5000-expand",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Чи можна додати батареї пізніше?",
      en: "Can I add batteries later?",
    },
    answer: {
      uk: "Так. Систему можна почати з одного модуля й розширити, коли зросте споживання.",
      en: "Yes. Start with one module and expand the system as consumption grows.",
    },
  },
  {
    id: "svit-plus-5000-maintenance",
    topic: "warranty",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Чи потрібне обслуговування?",
      en: "Does it need maintenance?",
    },
    answer: {
      uk: "Ні, спеціального обслуговування не потрібно — лише періодична діагностика.",
      en: "No special maintenance is needed — only periodic diagnostics.",
    },
  },
  {
    id: "svit-plus-5000-cold",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "Чи працює батарея в холодному приміщенні?",
      en: "Does the battery work in a cold room?",
    },
    answer: {
      uk: "Так, від −10 °C: робочий діапазон — від −10 до +50 °C. У неопалюваних приміщеннях рекомендуємо мінімальний захист від морозу.",
      en: "Yes, from −10 °C: the operating range is −10 to +50 °C. In unheated rooms we recommend basic frost protection.",
    },
  },
  {
    id: "svit-plus-5000-inverters",
    topic: "products",
    pages: ["svit-plus-5000"],
    question: {
      uk: "З якими інверторами працює SVIT PLUS 5000?",
      en: "Which inverters does SVIT PLUS 5000 work with?",
    },
    answer: {
      uk: "З гібридними й сонячними інверторами на 48 В: батарея обмінюється даними з інвертором через RS485 або CAN. У комплекті SVIT HOME її поєднують з гібридним інвертором VICTOR NM-ECO-6.2 kW PLUS. Сумісність саме з вашим інвертором підтвердить інженер.",
      en: "With 48 V hybrid and solar inverters: the battery talks to the inverter over RS485 or CAN. In the SVIT HOME kit it is paired with the VICTOR NM-ECO-6.2 kW PLUS hybrid inverter. An engineer will confirm compatibility with your inverter.",
    },
  },
  {
    id: "svit-plus-5000-runtime",
    topic: "backup",
    pages: ["svit-plus-5000"],
    question: {
      uk: "На скільки годин вистачить однієї батареї SVIT PLUS 5000?",
      en: "How many hours does one SVIT PLUS 5000 battery last?",
    },
    answer: {
      uk: "Залежить від навантаження: 5,12 кВт·год при 0,5 кВт (котел, холодильник, світло й роутер) — приблизно 9–10 годин. Для довшого резерву модулі з'єднують паралельно — до 16 штук, до 81 кВт·год.",
      en: "It depends on the load: 5.12 kWh at 0.5 kW (boiler, fridge, lights and router) lasts about 9–10 hours. For longer backup, connect modules in parallel — up to 16, up to 81 kWh.",
    },
  },
  {
    id: "svit-home-inverter",
    topic: "products",
    pages: ["svit-home"],
    question: {
      uk: "Який інвертор і яка батарея входять у SVIT HOME?",
      en: "Which inverter and battery come with SVIT HOME?",
    },
    answer: {
      uk: "Гібридний інвертор VICTOR NM-ECO-6.2 kW PLUS (6,2 кВт, 48 В, контролер заряду 120 А, режим UPS) і батарея SVIT PLUS 5000 LiFePO₄ (48 В, 100 Аг, 5,12 кВт·год, понад 10 000 циклів). Обидва змонтовані на металевій стійці на ніжках.",
      en: "A VICTOR NM-ECO-6.2 kW PLUS hybrid inverter (6.2 kW, 48 V, 120 A charge controller, UPS mode) and an SVIT PLUS 5000 LiFePO₄ battery (48 V, 100 Ah, 5.12 kWh, over 10,000 cycles), both on a metal rack on legs.",
    },
  },
  {
    id: "svit-home-vs-svit-plus-5000",
    topic: "products",
    pages: ["svit-home"],
    question: {
      uk: "Чим SVIT HOME відрізняється від SVIT PLUS 5000?",
      en: "How is SVIT HOME different from SVIT PLUS 5000?",
    },
    answer: {
      uk: "SVIT PLUS 5000 — це лише батарея, до якої потрібен окремий інвертор. SVIT HOME — готовий комплект: та сама батарея SVIT PLUS 5000, гібридний інвертор VICTOR 6,2 кВт і стійка, зібрані й узгоджені на виробництві INIT ENERGY.",
      en: "SVIT PLUS 5000 is the battery alone and needs a separate inverter. SVIT HOME is a ready kit: the same SVIT PLUS 5000 battery, a 6.2 kW VICTOR hybrid inverter and a rack, assembled and matched at INIT ENERGY.",
    },
  },
  {
    id: "svit-home-no-wall-mounting",
    topic: "products",
    pages: ["svit-home"],
    question: {
      uk: "Чи можна встановити SVIT HOME без монтажу на стіну?",
      en: "Can SVIT HOME be installed without wall mounting?",
    },
    answer: {
      uk: "Так. Це вертикальна стійка на ніжках — її можна поставити в будь-якому зручному місці.",
      en: "Yes. It is a vertical rack on legs that can be placed in any convenient spot.",
    },
  },
  {
    id: "svit-home-add-solar",
    topic: "solar",
    pages: ["svit-home"],
    question: {
      uk: "Чи можна підключити сонячні панелі пізніше?",
      en: "Can solar panels be connected later?",
    },
    answer: {
      uk: "Так. Гібридний інвертор готовий до інтеграції з фотоелектричними модулями — комплект стане сонячною станцією.",
      en: "Yes. The hybrid inverter is ready to integrate with photovoltaic modules, turning the kit into a solar power plant.",
    },
  },
  {
    id: "svit-home-outage",
    topic: "backup",
    pages: ["svit-home"],
    question: {
      uk: "Чи працює комплект під час відключень?",
      en: "Does the kit work during outages?",
    },
    answer: {
      uk: "Так. Коли мережу вимикають, SVIT HOME автоматично переходить на живлення від батареї.",
      en: "Yes. When the grid goes down, SVIT HOME automatically switches to battery power.",
    },
  },
  {
    id: "svit-home-warranty",
    topic: "warranty",
    pages: ["svit-home"],
    question: {
      uk: "Яка гарантія на SVIT HOME?",
      en: "What warranty does SVIT HOME have?",
    },
    answer: {
      uk: "Комплект має гарантію від виробника, післяпродажний сервіс і послуги з монтажу. На батарею SVIT PLUS 5000 — 5 років офіційної гарантії з можливістю продовження.",
      en: "SVIT HOME comes with a manufacturer's warranty, after-sales service and installation services. The SVIT PLUS 5000 battery has a 5-year official warranty that can be extended.",
    },
  },
  {
    id: "svit-home-lifetime",
    topic: "products",
    pages: ["svit-home"],
    question: {
      uk: "Який термін служби батареї?",
      en: "What is the battery service life?",
    },
    answer: {
      uk: "Понад 10 000 циклів заряду й розряду.",
      en: "Over 10,000 charge and discharge cycles.",
    },
  },
  {
    id: "svit-home-maintenance",
    topic: "warranty",
    pages: ["svit-home"],
    question: {
      uk: "Чи потрібне обслуговування?",
      en: "Does it need maintenance?",
    },
    answer: {
      uk: "Спеціального обслуговування батарея не потребує — достатньо періодичної діагностики.",
      en: "The battery needs no special maintenance; periodic diagnostics are sufficient.",
    },
  },
  {
    id: "svit-home-winter",
    topic: "products",
    pages: ["svit-home"],
    question: {
      uk: "Чи працює комплект узимку?",
      en: "Does the kit work in winter?",
    },
    answer: {
      uk: "Батарея розрахована на −10 … +50 °C. У неопалюваних приміщеннях рекомендуємо мінімальний захист від морозу.",
      en: "The battery is rated for −10 … +50 °C. In unheated rooms we recommend basic frost protection.",
    },
  },
];

export function faqForPage(page: FaqPage): Faq[] {
  return faqList.filter((faq) => faq.pages.includes(page));
}
