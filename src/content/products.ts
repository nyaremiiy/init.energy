import type { Locale, Localized } from "@/i18n/config";
import { formatNumber, formatQuantity, type Quantity } from "@/lib/format";

import { anchors, routes, toAnchor } from "./routes";
import type { ProductPageContent } from "./product-pages";
import type { SegmentIconId } from "./segments";

// Source: product pages on https://init.energy (checked 2026-11-06, specs and focus texts re-checked 2026-11-09).
export type ProductId =
  "svit600" | "svitHome" | "svitPlus5000" | "svitPlus16000" | "lithiumvalley";

/** Keys of `messages.specs` used as spec row labels. */
export type SpecKey =
  | "capacity"
  | "power"
  | "chemistry"
  | "inverter"
  | "cycles"
  | "minCapacity"
  | "maxCapacity"
  | "type";

export type ProductSpec = {
  key: SpecKey;
  /** A quantity (formatted per locale) or the same text in every locale. */
  value: Quantity | string;
};

export type ProductImage = {
  src: string;
  alt: Localized;
  width: number;
  height: number;
};

export type Product = {
  id: ProductId;
  /** SVIT = INIT ENERGY line; LITHIUMVALLEY = partner brand (INIT ENERGY is the official representative and installer). */
  brand: "SVIT" | "LITHIUMVALLEY";
  name: string;
  /** Product pages exist in Ukrainian only, so the same URL on every locale. */
  href: string;
  /** Product type for the comparison table. */
  type: Localized;
  /** Who it is for; `undefined` = not stated on init.energy yet. */
  audience?: Localized;
  /** Short description for product cards. */
  description: Localized;
  /**
   * Longer description for the focused product in the home tabs. Built only
   * from facts already on init.energy (see the specs and summaries below).
   */
  focusDescription: Localized;
  /** Main capacity, shown in tables and solution cards. */
  capacity: Quantity;
  /** Mono label on the capacity card: chemistry and build. */
  chemistryLabel: Localized;
  /** Number of cells, when stated on init.energy (drawn as a cell grid). */
  cellCount?: number;
  /** Number of cabinets/modules for industrial systems (drawn as a row). */
  modules?: number;
  /** The three specs shown next to the capacity card (keys of `specs`). */
  focusSpecs: [SpecKey, SpecKey, SpecKey];
  /** Rows of the product card spec list. */
  specs: ProductSpec[];
  /** Segment label shown on the product card. */
  segment: Localized;
  segmentIcon: SegmentIconId;
  image?: ProductImage;
  /** Full product page content; this product remains its single source. */
  page?: ProductPageContent;
};

/** Ordered product line: cards and the comparison table read from this list. */
export const productList: Product[] = [
  {
    id: "svit600",
    brand: "SVIT",
    name: "SVIT 600",
    href: routes.products.svit600,
    type: { uk: "Портативна станція", en: "Portable power station" },
    audience: { uk: "Квартира", en: "Apartment" },
    description: {
      uk: "Портативна станція для квартири",
      en: "Portable power station for an apartment",
    },
    focusDescription: {
      uk: "Портативна станція з чистою синусоїдою: 865 Вт·год і 600 Вт (пікова 1 200 Вт). Роутер і освітлення працюють до 70 годин, ноутбук — до 10. Заряджається від мережі, генератора або сонячної панелі приблизно за 4 години.",
      en: "A pure sine wave portable station: 865 Wh and 600 W (1,200 W peak). A router and lights run for up to 70 hours, a laptop for up to 10. It charges from the grid, a generator or a solar panel in about 4 hours.",
    },
    capacity: { value: 865, unit: "Wh" },
    // Owner data; /svit-600/ itself shows both Li-ion (table) and LiFePO₄ (text).
    chemistryLabel: { uk: "LiFePO₄", en: "LiFePO₄" },
    // TODO(content): cell count is not stated on init.energy.
    focusSpecs: ["capacity", "power", "cycles"],
    specs: [
      { key: "capacity", value: { value: 865, unit: "Wh" } },
      { key: "power", value: { value: 600, unit: "W" } },
      // Battery type is ambiguous on /svit-600/ (Li-ion in the table, LiFePO₄ in the text) — not shown.
      {
        key: "cycles",
        value: { value: 2000, unit: "cycles", qualifier: "plus" },
      },
    ],
    segment: { uk: "Квартира", en: "Apartment" },
    segmentIcon: "apartment",
    // TODO(content): confirm whether the nominal capacity is 865 or 864 Wh and whether the battery chemistry is LiFePO₄ or Li-ion.
    // TODO(content): add confirmed weight, dimensions, operating temperature, warranty, grid charging power, IP rating, certificates and a dedicated 1200×630 OG image.
    // TODO(content): confirm the typical load in watts for every runtime example.
    page: {
      slug: "svit-600",
      meta: {
        title: { uk: "SVIT 600 — портативна зарядна станція 865 Вт·год", en: "SVIT 600 — 865 Wh portable power station" },
        description: { uk: "Портативна станція SVIT 600: 865 Вт·год, 600 Вт номінально й 1 200 Вт піково, 9 виходів, тиха робота та заряджання від мережі або сонця.", en: "SVIT 600 portable power station with 865 Wh, 600 W rated and 1,200 W peak output, nine ports, quiet operation and solar charging." },
      },
      hero: {
        typeLabel: { uk: "Портативна зарядна станція", en: "Portable power station" },
        segmentLabel: { uk: "Квартира й подорожі", en: "Apartment and travel" },
        lead: { uk: "Енергія, яку можна взяти із собою: 865 Вт·год і 600 Вт чистої синусоїди для техніки вдома, у дорозі та під час відключень.", en: "Portable power for home, travel and outages: 865 Wh of stored energy and a 600 W pure sine wave output for everyday electronics." },
        keySpecs: [
          { value: { quantity: { value: 865, unit: "Wh" } }, label: { uk: "ємність", en: "capacity" } },
          { value: { quantity: { value: 600, unit: "W" } }, label: { uk: "номінальна потужність", en: "rated power" } },
          { value: { quantity: { value: 1200, unit: "W" } }, label: { uk: "пікова потужність", en: "peak power" } },
          { value: { text: { uk: "< 40 дБ", en: "< 40 dB" } }, label: { uk: "рівень шуму", en: "noise level" } },
        ],
        warranty: { title: { uk: "Ресурс батареї", en: "Battery life" }, value: { uk: "2 000+ циклів", en: "2,000+ cycles" }, note: { uk: "повний заряд ≈ 4 години", en: "full charge in about 4 hours" } },
        tags: [{ uk: "Чиста синусоїда", en: "Pure sine wave" }, { uk: "Заряд від сонця", en: "Solar charging" }],
        primaryCta: { uk: "Придбати", en: "Buy SVIT 600" },
        secondaryCta: { label: { uk: "Порти й заряджання", en: "Ports and charging" }, anchor: "ports" },
        mediaAspect: "square",
        tagTone: "light",
      },
      advantages: {
        lead: { uk: "Компактне резервне живлення для чутливої техніки: без вихлопів, із тихою роботою та трьома способами заряджання.", en: "Compact backup power for sensitive electronics, with no fumes, quiet operation and three ways to recharge." },
        items: [
          { icon: "safety", figure: { uk: "~", en: "~" }, tag: { uk: "Живлення", en: "Power" }, title: { uk: "Чиста синусоїда", en: "Pure sine wave" }, text: { uk: "Безпечне живлення для ноутбуків, роутерів та іншої чутливої електроніки.", en: "Safe power for laptops, routers and other sensitive electronics." }, tone: "sky" },
          { icon: "balance", figure: { uk: "1 200 Вт", en: "1,200 W" }, tag: { uk: "Потужність", en: "Output" }, title: { uk: "Запас для запуску", en: "Startup headroom" }, text: { uk: "600 Вт номінальної та 1 200 Вт пікової потужності.", en: "600 W rated output with 1,200 W peak power." }, tone: "light" },
          { icon: "mobility", figure: { uk: "< 40 дБ", en: "< 40 dB" }, tag: { uk: "Комфорт", en: "Comfort" }, title: { uk: "Тиха робота", en: "Quiet operation" }, text: { uk: "Працює без пального, вихлопів і шкідливих викидів.", en: "Runs without fuel, exhaust fumes or harmful emissions." }, tone: "navy" },
          { icon: "solar", figure: { uk: "≈ 4 год", en: "≈ 4 h" }, tag: { uk: "Заряджання", en: "Charging" }, title: { uk: "Три джерела", en: "Three sources" }, text: { uk: "Заряджання від мережі, сонячної панелі або генератора.", en: "Recharge from the grid, a solar panel or a generator." }, tone: "dark" },
        ],
      },
      portable: {
        title: { uk: "9 виходів і 3 способи заряджання", en: "Nine outputs and three ways to recharge" },
        lead: { uk: "Підключайте побутову техніку й мобільні пристрої одночасно, не перевищуючи сумарні 600 Вт.", en: "Power household electronics and mobile devices together within the 600 W total rated output." },
        outputs: [
          { count: "2×", icon: "socket", label: { uk: "Розетки AC 220 В", en: "220 V AC sockets" }, note: { uk: "чиста синусоїда", en: "pure sine wave" } },
          { count: "5×", icon: "usb", label: { uk: "USB-A", en: "USB-A" }, note: { uk: "QC 3.0", en: "QC 3.0" } },
          { count: "1×", icon: "typeC", label: { uk: "USB-C", en: "USB-C" }, note: { uk: "Power Delivery 60 Вт", en: "60 W Power Delivery" } },
          { count: "1×", icon: "dc", label: { uk: "Вихід DC 12 В", en: "12 V DC output" }, note: { uk: "для сумісної техніки", en: "for compatible devices" } },
        ],
        charging: [
          { icon: "grid", label: { uk: "Мережа 220 В", en: "220 V grid" }, note: { uk: "звичайна розетка", en: "standard wall socket" } },
          { icon: "solar", label: { uk: "Сонячна панель", en: "Solar panel" }, note: { uk: "вхід 24 В / 20 А", en: "24 V / 20 A input" } },
          { icon: "generator", label: { uk: "Генератор", en: "Generator" }, note: { uk: "заряджання поза мережею", en: "off-grid charging" } },
        ],
        chargeTime: { uk: "≈ 4 години", en: "≈ 4 hours" },
        chargeTimeLabel: { uk: "до повного заряду", en: "to a full charge" },
      },
      runtime: {
        title: { uk: "Скільки пропрацює ваша техніка", en: "How long your devices can run" },
        lead: { uk: "Орієнтовний час роботи від повністю зарядженої станції SVIT 600.", en: "Estimated runtime from a fully charged SVIT 600." },
        note: { uk: "Фактичний час залежить від потужності, режиму роботи й стану підключеного пристрою.", en: "Actual runtime depends on device power, operating mode and condition." },
        items: [
          // TODO(content): confirm the representative laptop load in watts.
          { icon: "laptop", device: { uk: "Ноутбук", en: "Laptop" }, value: { uk: "до 10", en: "up to 10" }, unit: { uk: "год", en: "hours" }, loadW: undefined },
          // TODO(content): confirm the combined router and lighting load in watts.
          { icon: "router", device: { uk: "Роутер і освітлення", en: "Router and lighting" }, value: { uk: "до 70", en: "up to 70" }, unit: { uk: "год", en: "hours" }, loadW: undefined },
          // TODO(content): confirm the representative refrigerator load in watts.
          { icon: "fridge", device: { uk: "Холодильник", en: "Fridge" }, value: { uk: "2–3", en: "2–3" }, unit: { uk: "год", en: "hours" }, loadW: undefined },
        ],
      },
      specs: [],
      updatedAt: { uk: "Оновлено 10 листопада 2026", en: "Updated 10 November 2026" },
      specGroups: [
        { title: { uk: "Батарея й потужність", en: "Battery and power" }, rows: [
          { label: { uk: "Ємність", en: "Capacity" }, value: { quantity: { value: 865, unit: "Wh" } } },
          { label: { uk: "Номінальна потужність", en: "Rated output" }, value: { quantity: { value: 600, unit: "W" } } },
          { label: { uk: "Пікова потужність", en: "Peak output" }, value: { quantity: { value: 1200, unit: "W" } } },
          { label: { uk: "Ресурс", en: "Cycle life" }, value: { text: { uk: "2 000+ циклів", en: "2,000+ cycles" } } },
          { label: { uk: "Рівень шуму", en: "Noise" }, value: { text: { uk: "< 40 дБ", en: "< 40 dB" } } },
        ] },
        { title: { uk: "Виходи", en: "Outputs" }, rows: [
          { label: { uk: "AC 220 В", en: "220 V AC" }, value: { text: { uk: "2 розетки, чиста синусоїда", en: "2 sockets, pure sine wave" } } },
          { label: { uk: "USB-A", en: "USB-A" }, value: { text: { uk: "5 × QC 3.0", en: "5 × QC 3.0" } } },
          { label: { uk: "USB-C", en: "USB-C" }, value: { text: { uk: "1 × PD 60 Вт", en: "1 × PD 60 W" } } },
          { label: { uk: "DC", en: "DC" }, value: { text: { uk: "1 × 12 В", en: "1 × 12 V" } } },
        ] },
        { title: { uk: "Заряджання", en: "Charging" }, rows: [
          { label: { uk: "Джерела", en: "Sources" }, value: { text: { uk: "мережа 220 В, сонячна панель, генератор", en: "220 V grid, solar panel, generator" } } },
          { label: { uk: "Сонячний вхід", en: "Solar input" }, value: { text: { uk: "24 В / 20 А", en: "24 V / 20 A" } } },
          { label: { uk: "Повний заряд", en: "Full charge" }, value: { text: { uk: "≈ 4 години", en: "≈ 4 hours" } } },
        ] },
        { title: { uk: "Захист і керування", en: "Protection and controls" }, rows: [
          { label: { uk: "Захист", en: "Protection" }, value: { text: { uk: "перевантаження, перегрів, коротке замикання", en: "overload, overheating, short circuit" } } },
          { label: { uk: "Запобіжники", en: "Fuses" }, value: { text: { uk: "8 А та 15 А", en: "8 A and 15 A" } } },
          { label: { uk: "Керування", en: "Controls" }, value: { text: { uk: "дисплей, окремі кнопки AC, 12 В та USB", en: "display and separate AC, 12 V and USB controls" } } },
        ] },
      ],
      specsDevelopmentNotice: { uk: "TODO(content): підтвердити 865/864 Вт·год і LiFePO₄/Li-ion; додати вагу, габарити, температуру, гарантію, потужність заряджання від мережі, IP та сертифікати.", en: "TODO(content): confirm 865/864 Wh and LiFePO₄/Li-ion; add weight, dimensions, temperature, warranty, grid charging power, IP rating and certificates." },
      applications: {
        title: { uk: "Де стане у пригоді SVIT 600", en: "Where SVIT 600 fits" },
        lead: { uk: "Одна портативна станція для резерву вдома та живлення техніки поза розеткою.", en: "One portable station for backup at home and power away from a wall socket." },
        items: [
          { icon: "house", tag: { uk: "Дім", en: "Home" }, title: { uk: "Квартира під час відключень", en: "Apartment outages" }, text: { uk: "Роутер, освітлення, ноутбук і заряджання телефонів.", en: "Keep the router, lights, laptop and phones powered." }, tone: "sky", links: [{ label: { uk: "Резерв для квартири", en: "Apartment backup" }, href: routes.backup.apartment }] },
          { icon: "travel", tag: { uk: "Мобільність", en: "Mobility" }, title: { uk: "Подорожі", en: "Travel" }, text: { uk: "Живлення техніки в дорозі без стаціонарного монтажу.", en: "Portable power on the road with no fixed installation." }, tone: "navy", links: [{ label: { uk: "Лінійка SVIT", en: "SVIT range" }, href: routes.catalog }] },
          { icon: "work", tag: { uk: "Робота", en: "Work" }, title: { uk: "Робота на виїзді", en: "Field work" }, text: { uk: "Ноутбук, зв'язок та інструменти в межах потужності станції.", en: "Run a laptop, communications and tools within the station output." }, tone: "sky", links: [{ label: { uk: "Лінійка SVIT", en: "SVIT range" }, href: routes.catalog }] },
          { icon: "camping", tag: { uk: "Відпочинок", en: "Outdoors" }, title: { uk: "Кемпінг і риболовля", en: "Camping and fishing" }, text: { uk: "Світло, зв'язок і невелика техніка далеко від мережі.", en: "Lighting, communications and small devices away from the grid." }, tone: "dark", links: [{ label: { uk: "Лінійка SVIT", en: "SVIT range" }, href: routes.catalog }] },
        ],
      },
      related: ["svitHome", "svitPlus5000", "svitPlus16000"],
      relatedLinks: [{ title: { uk: "Порівняти всю лінійку", en: "Compare the full range" }, summary: { uk: "Портативні, домашні та модульні накопичувачі SVIT", en: "Portable, home and modular SVIT storage" }, href: routes.catalog }],
      consultation: {
        title: { uk: "Замовити SVIT 600", en: "Order SVIT 600" },
        lead: { uk: "Залиште телефон — менеджер уточнить ваші потреби, наявність і умови придбання SVIT 600.", en: "Leave your phone number and a manager will confirm your needs, availability and purchase details for SVIT 600." },
        summary: { uk: "SVIT 600 · 865 Вт·год · 600 Вт", en: "SVIT 600 · 865 Wh · 600 W" },
        commentPlaceholder: { uk: "Яку техніку плануєте підключати", en: "Which devices do you plan to power?" },
        submit: { uk: "Придбати SVIT 600", en: "Buy SVIT 600" },
      },
    },
    image: {
      src: "/images/products/svit-600.avif",
      alt: {
        uk: "Портативна станція SVIT 600 з двома розетками 220 В, USB-портами і дисплеєм заряду на столі в квартирі",
        en: "SVIT 600 portable power station with two 220 V sockets, USB ports and a charge display on a table in an apartment",
      },
      width: 1254,
      height: 1254,
    },
  },
  {
    id: "svitHome",
    brand: "SVIT",
    name: "SVIT HOME",
    href: routes.products.svitHome,
    type: { uk: "Комплекс резервного живлення", en: "Backup power kit" },
    audience: { uk: "Приватний будинок", en: "Private house" },
    description: {
      uk: "Резервне живлення для всього будинку",
      en: "Backup power for the whole house",
    },
    focusDescription: {
      uk: "Готовий комплект для будинку й малого бізнесу: гібридний інвертор 6,2 кВт і батарея SVIT PLUS 5000 на 5,12 кВт·год на стійці на ніжках — без настінного монтажу. Під час відключення сам переходить на батарею, а з панелями працює як сонячна станція.",
      en: "A ready kit for a house or small business: a 6.2 kW hybrid inverter and a 5.12 kWh SVIT PLUS 5000 battery on a rack on legs — no wall mounting. It switches to the battery by itself during an outage and works as a solar plant with panels.",
    },
    capacity: { value: 5.12, unit: "kWh" },
    // /svit-home/: battery SVIT Plus 5000, LiFePO₄.
    chemistryLabel: {
      uk: "LiFePO₄ · батарея SVIT PLUS 5000",
      en: "LiFePO₄ · SVIT PLUS 5000 battery",
    },
    // TODO(content): cell count is not stated on init.energy.
    focusSpecs: ["capacity", "inverter", "cycles"],
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "inverter", value: { value: 6.2, unit: "kW" } },
      {
        key: "cycles",
        value: { value: 10000, unit: "cycles", qualifier: "plus" },
      },
    ],
    segment: { uk: "Приватний будинок", en: "Private house" },
    segmentIcon: "house",
    // Hero and composition photos are in place; a photo of the whole kit is still TODO(content).
    // TODO(content): add system voltage, dimensions, weight, interfaces,
    // inverter warranty and datasheet PDF when the owner confirms them.
    // Until then these rows and links are intentionally absent.
    page: {
      slug: "svit-home",
      meta: {
        title: {
          uk: "SVIT HOME — комплект резервного живлення 6,2 кВт, 5,12 кВт·год",
          en: "SVIT HOME — 6.2 kW, 5.12 kWh backup power kit",
        },
        description: {
          uk: "Готовий комплект резервного живлення: гібридний інвертор VICTOR 6,2 кВт і батарея LiFePO₄ 5,12 кВт·год. Для квартири, будинку, ОСББ і бізнесу.",
          en: "A ready backup power kit: a 6.2 kW VICTOR hybrid inverter and a 5.12 kWh LiFePO₄ battery. For apartments, houses, housing associations and businesses.",
        },
      },
      hero: {
        typeLabel: {
          uk: "Комплект резервного живлення",
          en: "Backup power kit",
        },
        segmentLabel: {
          uk: "Дім і малий бізнес",
          en: "Home and small business",
        },
        lead: {
          uk: "Готовий комплект резервного живлення: гібридний інвертор VICTOR 6,2 кВт і батарея SVIT PLUS 5000 на 5,12 кВт·год на стійці на ніжках. Працює одразу після підключення — від мережі, батареї або сонячних панелей.",
          en: "A ready backup power kit with a 6.2 kW VICTOR hybrid inverter and a 5.12 kWh SVIT PLUS 5000 battery on a rack on legs. It works as soon as it is connected — from the grid, battery or solar panels.",
        },
        keySpecs: [
          {
            value: { quantity: { value: 6.2, unit: "kW" } },
            label: { uk: "гібридний інвертор", en: "hybrid inverter" },
          },
          {
            value: { quantity: { value: 5.12, unit: "kWh" } },
            label: { uk: "батарея LiFePO₄", en: "LiFePO₄ battery" },
          },
          {
            value: { text: { uk: "10 000+", en: "10,000+" } },
            label: { uk: "циклів", en: "cycles" },
          },
          {
            value: { text: { uk: "3 в 1", en: "3 in 1" } },
            label: {
              uk: "інвертор · батарея · стійка",
              en: "inverter · battery · rack",
            },
          },
        ],
        warranty: {
          title: {
            uk: "Гарантія на батарею",
            en: "Battery warranty",
          },
          value: { uk: "5 років", en: "5 years" },
          note: {
            uk: "з можливістю продовження",
            en: "extendable",
          },
        },
        tags: [
          { uk: "Стійка на ніжках", en: "Rack on legs" },
          {
            uk: "Готовий до сонячних панелей",
            en: "Solar-panel ready",
          },
        ],
        secondaryCta: {
          label: {
            uk: "Що входить у комплект",
            en: "What is included",
          },
          anchor: "composition",
        },
      },
      advantages: {
        lead: {
          uk: "Усе для резервного живлення в одному комплекті: підключили — і будинок працює під час відключень.",
          en: "Everything for backup power in one kit: connect it and your home keeps running during outages.",
        },
        items: [
          {
            icon: "kit",
            figure: { uk: "3 в 1", en: "3 in 1" },
            tag: { uk: "Комплект", en: "Kit" },
            title: { uk: "Усе в одному", en: "Everything in one" },
            text: {
              uk: "Інвертор, батарея й стійка постачаються як готовий комплект, що працює одразу після підключення.",
              en: "The inverter, battery and rack come as a ready kit that works as soon as it is connected.",
            },
            tone: "sky",
          },
          {
            icon: "mobility",
            figure: { uk: "Ніжки", en: "Legs" },
            tag: { uk: "Установка", en: "Installation" },
            title: {
              uk: "Без монтажу на стіну",
              en: "No wall mounting",
            },
            text: {
              uk: "Комплект стоїть на ніжках — настінний монтаж не потрібен.",
              en: "The kit stands on legs, so no wall mounting is needed.",
            },
            tone: "light",
          },
          {
            icon: "solar",
            figure: { uk: "Гібрид", en: "Hybrid" },
            tag: { uk: "Сонце", en: "Solar" },
            title: { uk: "Резерв або СЕС", en: "Backup or solar" },
            text: {
              uk: "Працює як резервне живлення, а з сонячними панелями — як повноцінна сонячна станція.",
              en: "It works as backup power and becomes a complete solar power plant when panels are added.",
            },
            tone: "navy",
          },
          {
            icon: "safety",
            figure: { uk: "10 000+", en: "10,000+" },
            tag: { uk: "Безпека", en: "Safety" },
            title: {
              uk: "Батарея LiFePO₄",
              en: "LiFePO₄ battery",
            },
            text: {
              uk: "Стабільна хімія із захистом від перегріву й ресурсом понад 10 000 циклів заряду й розряду.",
              en: "Stable chemistry with overheating protection and over 10,000 charge and discharge cycles.",
            },
            tone: "dark",
          },
        ],
      },
      composition: {
        title: {
          uk: "Що входить у SVIT HOME",
          en: "What SVIT HOME includes",
        },
        lead: {
          uk: "Три компоненти, зібрані й узгоджені на заводі INIT ENERGY.",
          en: "Three components assembled and matched at the INIT ENERGY factory.",
        },
        items: [
          {
            title: {
              uk: "Гібридний інвертор VICTOR 6,2 кВт",
              en: "VICTOR 6.2 kW hybrid inverter",
            },
            image: {
              src: "/images/products/svit-home/invertor.avif",
              alt: {
                uk: "Гібридний інвертор VICTOR NM-ECO-6.2 kW PLUS на світлій стіні",
                en: "VICTOR NM-ECO-6.2 kW PLUS hybrid inverter on a light wall",
              },
            },
            text: {
              uk: "Модель VICTOR NM-ECO-6.2 kW PLUS. Безперебійний режим (UPS) — автоматичний перехід на батарею під час відключень. Працює з мережею, батареєю та сонячними панелями.",
              en: "Model VICTOR NM-ECO-6.2 kW PLUS. Uninterruptible power (UPS) mode — switches to the battery automatically during outages. Works with the grid, battery and solar panels.",
            },
            specs: [
              {
                label: { uk: "Потужність", en: "Power" },
                value: { uk: "6,2 кВт (6200 Вт)", en: "6.2 kW (6200 W)" },
              },
              {
                label: { uk: "Напруга", en: "Voltage" },
                value: { uk: "48 В", en: "48 V" },
              },
              {
                label: { uk: "Контролер заряду", en: "Charge controller" },
                value: { uk: "120 А", en: "120 A" },
              },
              {
                label: { uk: "Тип", en: "Type" },
                value: { uk: "гібридний", en: "hybrid" },
              },
            ],
          },
          {
            title: {
              uk: "Батарея SVIT PLUS 5000",
              en: "SVIT PLUS 5000 battery",
            },
            image: {
              src: "/images/products/svit-plus-5000.avif",
              alt: {
                uk: "Батарея SVIT PLUS 5000 LiFePO₄ з клемами, автоматом і портами CAN та RS485",
                en: "SVIT PLUS 5000 LiFePO₄ battery with terminals, a breaker and CAN and RS485 ports",
              },
            },
            text: {
              uk: "Акумуляторний блок LiFePO₄ власного виробництва.",
              en: "An in-house LiFePO₄ battery pack.",
            },
            specs: [
              {
                label: { uk: "Ємність", en: "Capacity" },
                value: { uk: "5,12 кВт·год (100 Аг)", en: "5.12 kWh (100 Ah)" },
              },
              {
                label: { uk: "Ресурс", en: "Lifetime" },
                value: { uk: "понад 10 000 циклів", en: "over 10,000 cycles" },
              },
            ],
            relatedProduct: "svitPlus5000",
            linkLabel: {
              uk: "Про батарею SVIT PLUS 5000",
              en: "About the SVIT PLUS 5000 battery",
            },
          },
          {
            title: { uk: "Стійка на ніжках", en: "Rack on legs" },
            image: {
              src: "/images/products/svit-home/standalone.avif",
              alt: {
                uk: "Порожня металева стійка на ніжках для інвертора й батареї",
                en: "Empty metal rack on legs for the inverter and battery",
              },
            },
            text: {
              uk: "Вертикальна металева стійка на ніжках з відсіком для щитка з автоматами.",
              en: "A vertical metal rack on legs with a compartment for a breaker panel.",
            },
            specs: [
              {
                label: { uk: "Монтаж", en: "Mounting" },
                value: { uk: "не потрібен", en: "not required" },
              },
              {
                label: { uk: "Опора", en: "Support" },
                value: { uk: "ніжки", en: "legs" },
              },
            ],
          },
        ],
        modesEyebrow: {
          uk: "Режими роботи",
          en: "Operating modes",
        },
        modesTitle: {
          uk: "Один комплекс — три сценарії",
          en: "One kit — three scenarios",
        },
        modes: [
          {
            icon: "backup",
            title: {
              uk: "Резервне живлення",
              en: "Backup power",
            },
            text: {
              uk: "Коли мережу вимикають, комплект автоматично переходить на батарею.",
              en: "When the grid goes down, the kit automatically switches to the battery.",
            },
          },
          {
            icon: "solar",
            title: {
              uk: "Сонячна станція",
              en: "Solar power plant",
            },
            text: {
              uk: "Додайте сонячні панелі — гібридний інвертор живитиме будинок від сонця.",
              en: "Add solar panels and the hybrid inverter will power the house from the sun.",
            },
          },
          {
            icon: "grid",
            title: {
              uk: "Разом з мережею",
              en: "Together with the grid",
            },
            text: {
              uk: "Працює з наявною мережею або автономно — без складного монтажу.",
              en: "Works with the existing grid or autonomously, without complex installation.",
            },
          },
        ],
      },
      specs: [
        {
          label: { uk: "Інвертор", en: "Inverter" },
          value: {
            text: {
              uk: "гібридний, 6,2 кВт · VICTOR NM-ECO-6.2 kW PLUS",
              en: "hybrid, 6.2 kW · VICTOR NM-ECO-6.2 kW PLUS",
            },
          },
        },
        {
          label: { uk: "Батарея", en: "Battery" },
          value: { text: { uk: "SVIT PLUS 5000, LiFePO₄", en: "SVIT PLUS 5000, LiFePO₄" } },
        },
        {
          label: { uk: "Системна напруга", en: "System voltage" },
          value: { text: { uk: "48 В", en: "48 V" } },
        },
        {
          label: { uk: "Ємність батареї", en: "Battery capacity" },
          value: { text: { uk: "5,12 кВт·год (100 Аг)", en: "5.12 kWh (100 Ah)" } },
        },
        {
          label: { uk: "Ресурс батареї", en: "Battery lifetime" },
          value: { text: { uk: "понад 10 000 циклів", en: "over 10,000 cycles" } },
        },
        {
          label: { uk: "Робоча температура батареї", en: "Battery operating temperature" },
          value: { text: { uk: "−10 … +50 °C", en: "−10 … +50 °C" } },
        },
        {
          label: { uk: "Конструкція", en: "Construction" },
          value: { text: { uk: "вертикальна металева стійка на ніжках", en: "vertical metal rack on legs" } },
        },
        {
          label: { uk: "Додатково", en: "Additional" },
          value: { text: { uk: "відсік для щитка з автоматами та комутацією", en: "compartment for a breaker panel and switching" } },
        },
        {
          label: { uk: "Монтаж", en: "Mounting" },
          value: { text: { uk: "настінний монтаж не потрібен", en: "no wall mounting required" } },
        },
        {
          label: { uk: "Режими", en: "Modes" },
          value: { text: { uk: "резерв · СЕС · мережа або автономно", en: "backup · solar · grid or autonomous" } },
        },
        {
          label: { uk: "Гарантія на батарею", en: "Battery warranty" },
          value: { text: { uk: "5 років, з можливістю продовження", en: "5 years, extendable" } },
        },
      ],
      applications: {
        lead: {
          uk: "Для квартир, приватних і заміських будинків, об'єктів соціальної інфраструктури, ОСББ і підприємств.",
          en: "For apartments, private and country houses, social infrastructure facilities, housing associations (OSBB) and businesses.",
        },
        items: [
          {
            icon: "house",
            tag: { uk: "Житло", en: "Housing" },
            title: { uk: "Квартира і будинок", en: "Apartment and house" },
            text: {
              uk: "Живлення побутової техніки, освітлення й електроніки під час відключень.",
              en: "Power for home appliances, lighting and electronics during outages.",
            },
            tone: "sky",
            links: [
              { label: { uk: "Резервне живлення для будинку", en: "Backup power for a house" }, href: routes.backup.house },
              { label: { uk: "СЕС для дому", en: "Solar for a house" }, href: routes.services.turnkeySes },
            ],
          },
          {
            icon: "store",
            tag: { uk: "Соціальна інфраструктура", en: "Social infrastructure" },
            title: { uk: "Об'єкти й ОСББ", en: "Facilities and OSBB" },
            text: {
              uk: "Резервне живлення об'єктів соціальної інфраструктури та житлових об'єднань.",
              en: "Backup power for social infrastructure facilities and housing associations.",
            },
            tone: "navy",
            links: [
              { label: { uk: "Резервне живлення для бізнесу", en: "Backup power for business" }, href: routes.backup.business },
              { label: { uk: "СЕС для бізнесу", en: "Solar for business" }, href: routes.services.turnkeySes },
            ],
          },
          {
            icon: "factory",
            tag: { uk: "Бізнес", en: "Business" },
            title: { uk: "Підприємства", en: "Businesses" },
            text: {
              uk: "Резервне живлення підприємств. Комплект можна доповнити сонячними панелями й перетворити на енергоавтономну систему.",
              en: "Backup power for businesses. The kit can be extended with solar panels into an energy-autonomous system.",
            },
            tone: "dark",
            links: [
              { label: { uk: "Резервне живлення для бізнесу", en: "Backup power for business" }, href: routes.backup.business },
              { label: { uk: "Порівняти накопичувачі", en: "Compare batteries" }, href: toAnchor(anchors.compare) },
            ],
          },
        ],
      },
      related: ["svitPlus5000", "svitPlus16000", "svit600"],
      consultation: {
        lead: {
          uk: "Інженер INIT ENERGY уточнить, що потрібно живити, і назве вартість SVIT HOME з доставкою й підключенням.",
          en: "An INIT ENERGY engineer will clarify what needs power and quote SVIT HOME with delivery and connection.",
        },
        summary: {
          uk: "SVIT HOME · 6,2 кВт · 5,12 кВт·год",
          en: "SVIT HOME · 6.2 kW · 5.12 kWh",
        },
      },
    },
    image: {
      src: "/images/products/svit-home.avif",
      alt: {
        uk: "Комплекс SVIT HOME: гібридний інвертор над акумуляторною батареєю на білій стійці в інтер'єрі будинку",
        en: "SVIT HOME kit: a hybrid inverter above a battery on a white rack inside a house",
      },
      width: 1448,
      height: 1086,
    },
  },
  {
    id: "svitPlus5000",
    brand: "SVIT",
    name: "SVIT PLUS 5000",
    href: routes.products.svitPlus5000,
    type: { uk: "Батарея", en: "Battery" },
    // Source: /svit-plus-5000/ — «Підходить як для дому, так і для бізнесу».
    audience: { uk: "Дім і бізнес", en: "Home and business" },
    segment: { uk: "Дім і бізнес", en: "Home and business" },
    segmentIcon: "homeBusiness",
    description: {
      uk: "Акумуляторна батарея LiFePO₄",
      en: "LiFePO₄ battery",
    },
    focusDescription: {
      uk: "Батарея LiFePO₄ на 5,12 кВт·год і 5 кВт для дому, малого бізнесу й промислових об'єктів. Працює з інвертором у сонячній або гібридній станції, батареї з'єднуються паралельно — до 81 кВт·год. Гарантія 5 років.",
      en: "A 5.12 kWh, 5 kW LiFePO₄ battery for homes, small businesses and industrial sites. It works with an inverter in a solar or hybrid plant, and batteries connect in parallel up to 81 kWh. 5-year warranty.",
    },
    capacity: { value: 5.12, unit: "kWh" },
    chemistryLabel: {
      uk: "LiFePO₄ · до 16 модулів",
      en: "LiFePO₄ · up to 16 modules",
    },
    // TODO(content): cell count is not stated on init.energy.
    focusSpecs: ["capacity", "power", "cycles"],
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "power", value: { value: 5, unit: "kW" } },
      {
        key: "cycles",
        value: { value: 10000, unit: "cycles", qualifier: "plus" },
      },
    ],
    image: {
      src: "/images/products/svit-plus-5000.avif",
      alt: {
        uk: "Акумуляторна батарея SVIT PLUS 5000 з клемами, автоматичним вимикачем, індикатором заряду та портами CAN і RS485 на стелажі",
        en: "SVIT PLUS 5000 battery with terminals, a circuit breaker, a charge indicator and CAN and RS485 ports on a rack",
      },
      width: 1448,
      height: 1086,
    },
  },
  {
    id: "svitPlus16000",
    brand: "SVIT",
    name: "SVIT PLUS 16000",
    href: routes.products.svitPlus16000,
    type: { uk: "Батарея", en: "Battery" },
    // Source: /svit-plus-16000/ names use cases, not an audience.
    audience: {
      uk: "Сонячні станції та автономні системи",
      en: "Solar plants and off-grid systems",
    },
    segment: { uk: "Автономні системи", en: "Off-grid systems" },
    segmentIcon: "autonomous",
    description: {
      uk: "Акумуляторна батарея LiFePO₄ для автономних систем",
      en: "LiFePO₄ battery for off-grid systems",
    },
    focusDescription: {
      uk: "Батарея LiFePO₄ на 16,07 кВт·год з 16 комірок EVE для сонячних станцій, резервного живлення, автономних і гібридних систем. Вбудована BMS із CAN, RS485 і Bluetooth, сумісна з інверторами Deye, Growatt, Victron, Luxpower.",
      en: "A 16.07 kWh LiFePO₄ battery built from 16 EVE cells for solar plants, backup power, off-grid and hybrid systems. Built-in BMS with CAN, RS485 and Bluetooth, compatible with Deye, Growatt, Victron and Luxpower inverters.",
    },
    capacity: { value: 16.07, unit: "kWh" },
    chemistryLabel: {
      uk: "LiFePO₄ · 16 комірок EVE",
      en: "LiFePO₄ · 16 EVE cells",
    },
    // /svit-plus-16000/: 16 prismatic EVE cells, 16S1P.
    cellCount: 16,
    focusSpecs: ["capacity", "cycles", "chemistry"],
    specs: [
      { key: "capacity", value: { value: 16.07, unit: "kWh" } },
      {
        key: "cycles",
        value: { value: 6000, unit: "cycles", qualifier: "plus" },
      },
      { key: "chemistry", value: "LiFePO₄" },
    ],
    // TODO(content): clarify whether IP20 or IP44 applies, and confirm the exact
    // BMS current within the stated 100–200 A range.
    // TODO(content): parallel connection, mounting and datasheet PDF are not
    // stated by the source and are intentionally not rendered.
    // TODO(content): add approved 1200×630 OG art.
    page: {
      slug: "svit-plus-16000",
      meta: {
        title: {
          uk: "SVIT PLUS 16000 — батарея LiFePO₄ 16,07 кВт·год",
          en: "SVIT PLUS 16000 — 16.07 kWh LiFePO₄ battery",
        },
        description: {
          uk: "SVIT PLUS 16000: LiFePO₄ батарея 16,07 кВт·год, 51,2 В, 16 комірок EVE 314 А·год, BMS 200 А та 6 000–9 000+ циклів. Гарантія 5 років. Для СЕС і резерву.",
          en: "SVIT PLUS 16000: 16.07 kWh, 51.2 V LiFePO₄ battery with 16 EVE 314 Ah cells, 200 A BMS, 6,000–9,000+ cycles and a 5-year warranty.",
        },
      },
      hero: {
        typeLabel: { uk: "Акумуляторна батарея LiFePO₄", en: "LiFePO₄ battery" },
        segmentLabel: { uk: "СЕС і автономні системи", en: "Solar and off-grid systems" },
        segmentIcon: "sun",
        tagTone: "light",
        lead: {
          uk: "Батарея LiFePO₄ на 16,07 кВт·год з 16 призматичних комірок EVE для сонячних станцій, резервного живлення, автономних і гібридних систем. Вбудована BMS з активним балансуванням і зв'язком CAN, RS485 та Bluetooth.",
          en: "A 16.07 kWh LiFePO₄ battery built from 16 prismatic EVE cells for solar plants, backup power, off-grid and hybrid systems. Its built-in BMS provides active balancing plus CAN, RS485 and Bluetooth communication.",
        },
        keySpecs: [
          { value: { quantity: { value: 16.07, unit: "kWh" } }, label: { uk: "номінальна енергія", en: "nominal energy" } },
          { value: { text: { uk: "до 15,3 кВт·год", en: "up to 15.3 kWh" } }, label: { uk: "корисна енергія", en: "usable energy" } },
          { value: { quantity: { value: 51.2, unit: "V" } }, label: { uk: "номінальна напруга", en: "nominal voltage" } },
          { value: { text: { uk: "6 000+", en: "6,000+" } }, label: { uk: "циклів", en: "cycles" } },
        ],
        warranty: {
          title: { uk: "Гарантія", en: "Warranty" },
          value: { uk: "5 років", en: "5 years" },
          note: { uk: "строк служби — понад 10 років", en: "service life over 10 years" },
        },
        tags: [
          { uk: "16 комірок EVE", en: "16 EVE cells" },
          { uk: "CAN · RS485 · Bluetooth", en: "CAN · RS485 · Bluetooth" },
        ],
        secondaryCta: { label: { uk: "Усі характеристики", en: "All specifications" }, anchor: "specs" },
      },
      advantages: {
        lead: {
          uk: "Велика ємність в одному корпусі, комірки EVE і BMS, що працює з популярними інверторами.",
          en: "High capacity in one enclosure, EVE cells and a BMS that works with popular inverters.",
        },
        items: [
          { icon: "scale", figure: { uk: "16,07", en: "16.07" }, tag: { uk: "Ємність", en: "Capacity" }, title: { uk: "16 кВт·год в одному корпусі", en: "16 kWh in one enclosure" }, text: { uk: "Номінальна енергія 16,07 кВт·год, з них 14,5–15,3 кВт·год доступні для використання (90–95% DoD).", en: "Nominal energy is 16.07 kWh, with 14.5–15.3 kWh available for use at 90–95% DoD." }, tone: "sky" },
          { icon: "balance", figure: { uk: "EVE", en: "EVE" }, tag: { uk: "Комірки", en: "Cells" }, title: { uk: "16 призматичних комірок", en: "16 prismatic cells" }, text: { uk: "Конфігурація 16S1P: комірки EVE по 314 А·год з активним балансуванням 1–3 А.", en: "A 16S1P configuration with 314 Ah EVE cells and 1–3 A active balancing." }, tone: "light" },
          { icon: "safety", figure: { uk: "CAN", en: "CAN" }, tag: { uk: "Сумісність", en: "Compatibility" }, title: { uk: "Працює з вашим інвертором", en: "Works with your inverter" }, text: { uk: "Зв'язок CAN, RS485 і Bluetooth; сумісна з Deye, Growatt, Victron, Luxpower та іншими.", en: "CAN, RS485 and Bluetooth communication; compatible with Deye, Growatt, Victron, Luxpower and others." }, tone: "navy" },
          { icon: "cycles", figure: { uk: "9 000+", en: "9,000+" }, tag: { uk: "Ресурс", en: "Lifetime" }, title: { uk: "Понад 10 років роботи", en: "Over 10 years of service" }, text: { uk: "6 000–9 000+ циклів при глибині розряду 80–90% і стандартна гарантія 5 років.", en: "6,000–9,000+ cycles at 80–90% depth of discharge and a standard 5-year warranty." }, tone: "dark" },
        ],
      },
      inside: {
        title: { uk: "Що всередині SVIT PLUS 16000", en: "Inside SVIT PLUS 16000" },
        lead: { uk: "16 комірок EVE, BMS з активним балансуванням і зв'язок з інвертором — усе, від чого залежать безпека й ресурс.", en: "Sixteen EVE cells, a BMS with active balancing and inverter communication — everything that determines safety and service life." },
        cellBrand: "EVE",
        cellCount: 16,
        cellCapacityAh: 314,
        configuration: "16S1P",
        voltage: { uk: "51,2 В", en: "51.2 V" },
        stats: [
          { value: { uk: "314 А·год", en: "314 Ah" }, label: { uk: "номінальна ємність", en: "nominal capacity" } },
          { value: { uk: "40–58,4 В", en: "40–58.4 V" }, label: { uk: "робоча напруга", en: "operating voltage" } },
          { value: { uk: "до 95%", en: "up to 95%" }, label: { uk: "глибина розряду", en: "depth of discharge" } },
        ],
        bms: {
          title: { uk: "BMS 16S", en: "16S BMS" },
          lead: { uk: "Активне балансування комірок 1–3 А і захист від:", en: "1–3 A active cell balancing and protection against:" },
          protections: [
            { uk: "Перезаряду", en: "Overcharge" }, { uk: "Глибокого розряду", en: "Deep discharge" }, { uk: "Перевантаження", en: "Overload" }, { uk: "Короткого замикання", en: "Short circuit" }, { uk: "Перегріву", en: "Overheating" },
          ],
        },
        compatibility: {
          title: { uk: "Сумісні інвертори", en: "Compatible inverters" },
          lead: { uk: "Зв'язок через CAN, RS485 або Bluetooth", en: "Communication via CAN, RS485 or Bluetooth" },
          brands: [
            { uk: "Deye", en: "Deye" },
            { uk: "Growatt", en: "Growatt" },
            { uk: "Victron", en: "Victron" },
            { uk: "Luxpower", en: "Luxpower" },
            { uk: "та інші", en: "and others" },
          ],
        },
      },
      specs: [],
      specGroups: [
        { title: { uk: "Енергія й напруга", en: "Energy and voltage" }, rows: [
          { label: { uk: "Номінальна напруга", en: "Nominal voltage" }, value: { text: { uk: "51,2 В", en: "51.2 V" } } },
          { label: { uk: "Номінальна ємність", en: "Nominal capacity" }, value: { text: { uk: "314 А·год", en: "314 Ah" } } },
          { label: { uk: "Номінальна енергія", en: "Nominal energy" }, value: { text: { uk: "16,07 кВт·год", en: "16.07 kWh" } } },
          { label: { uk: "Корисна енергія", en: "Usable energy" }, value: { text: { uk: "14,5–15,3 кВт·год (90–95% DoD)", en: "14.5–15.3 kWh (90–95% DoD)" } } },
          { label: { uk: "Конфігурація", en: "Configuration" }, value: { text: { uk: "16S1P, 16 призматичних комірок EVE 314 А·год", en: "16S1P, 16 prismatic EVE 314 Ah cells" } } },
          { label: { uk: "Робоча напруга", en: "Operating voltage" }, value: { text: { uk: "40,0–58,4 В", en: "40.0–58.4 V" } } },
          { label: { uk: "Рекомендована напруга заряду", en: "Recommended charge voltage" }, value: { text: { uk: "56,0–57,6 В", en: "56.0–57.6 V" } } },
          { label: { uk: "Відсічення розряду", en: "Discharge cutoff" }, value: { text: { uk: "40,0–46,0 В", en: "40.0–46.0 V" } } },
        ] },
        { title: { uk: "Струми", en: "Currents" }, rows: [
          { label: { uk: "Рекомендований заряд/розряд", en: "Recommended charge/discharge" }, value: { text: { uk: "100–157 А", en: "100–157 A" } } },
          { label: { uk: "Максимальний постійний заряд", en: "Max continuous charge" }, value: { text: { uk: "160–200 А", en: "160–200 A" } } },
          { label: { uk: "Максимальний постійний розряд", en: "Max continuous discharge" }, value: { text: { uk: "200 А", en: "200 A" } } },
          { label: { uk: "Піковий розряд", en: "Peak discharge" }, value: { text: { uk: "220–250 А, короткочасно", en: "220–250 A, short-term" } } },
        ] },
        { title: { uk: "BMS і зв'язок", en: "BMS and communication" }, rows: [
          { label: { uk: "BMS", en: "BMS" }, value: { text: { uk: "16S, 100–200 А", en: "16S, 100–200 A" } } },
          { label: { uk: "Захисти", en: "Protections" }, value: { text: { uk: "Перезаряд, глибокий розряд, перевантаження, коротке замикання, перегрів", en: "Overcharge, deep discharge, overload, short circuit, overheating" } } },
          { label: { uk: "Активне балансування", en: "Active balancing" }, value: { text: { uk: "1–3 А", en: "1–3 A" } } },
          { label: { uk: "Інтерфейси", en: "Interfaces" }, value: { text: { uk: "CAN, RS485, Bluetooth", en: "CAN, RS485, Bluetooth" } } },
          { label: { uk: "Сумісні інвертори", en: "Compatible inverters" }, value: { text: { uk: "Deye, Growatt, Victron, Luxpower та інші", en: "Deye, Growatt, Victron, Luxpower and others" } } },
        ] },
        { title: { uk: "Корпус і умови", en: "Enclosure and conditions" }, rows: [
          { label: { uk: "Вага", en: "Weight" }, value: { text: { uk: "135 кг", en: "135 kg" } } },
          { label: { uk: "Габарити", en: "Dimensions" }, value: { text: { uk: "635 × 630 × 220 мм", en: "635 × 630 × 220 mm" } } },
          { label: { uk: "Ступінь захисту", en: "Ingress protection" }, value: { text: { uk: "IP20 – IP44", en: "IP20 – IP44" } } },
          { label: { uk: "Температура заряду", en: "Charge temperature" }, value: { text: { uk: "0 … +55 °C", en: "0 … +55 °C" } } },
          { label: { uk: "Температура розряду", en: "Discharge temperature" }, value: { text: { uk: "−20 … +55 °C; підігрів — платна опція", en: "−20 … +55 °C; heating is a paid option" } } },
          { label: { uk: "Температура зберігання", en: "Storage temperature" }, value: { text: { uk: "−20 … +35 °C", en: "−20 … +35 °C" } } },
          { label: { uk: "Охолодження", en: "Cooling" }, value: { text: { uk: "Пасивне", en: "Passive" } } },
        ] },
        { title: { uk: "Ресурс і гарантія", en: "Lifecycle and warranty" }, rows: [
          { label: { uk: "Кількість циклів", en: "Cycle life" }, value: { text: { uk: "6 000–9 000+ при 80–90% DoD", en: "6,000–9,000+ at 80–90% DoD" } } },
          { label: { uk: "Максимальна глибина розряду", en: "Maximum DoD" }, value: { text: { uk: "95%", en: "95%" } } },
          { label: { uk: "Строк служби", en: "Service life" }, value: { text: { uk: "Понад 10 років", en: "Over 10 years" } } },
          { label: { uk: "Гарантія", en: "Warranty" }, value: { text: { uk: "5 років", en: "5 years" } } },
        ] },
      ],
      applications: {
        lead: { uk: "Велика ємність закриває добу роботи будинку від сонця або кілька годин резерву для бізнесу.", en: "High capacity can cover a home's day from solar or provide several hours of backup for a business." },
        items: [
          { icon: "solar", tag: { uk: "СЕС", en: "Solar" }, title: { uk: "Сонячна станція", en: "Solar power plant" }, text: { uk: "Накопичує денну генерацію панелей, щоб використовувати її ввечері та вночі.", en: "Stores daytime solar generation for use in the evening and at night." }, tone: "sky", links: [
            { label: { uk: "СЕС для дому", en: "Solar for homes" }, href: routes.services.turnkeySes }, { label: { uk: "СЕС для бізнесу", en: "Solar for business" }, href: routes.services.turnkeySes },
          ] },
          { icon: "backup", tag: { uk: "Резерв", en: "Backup" }, title: { uk: "Резервне живлення", en: "Backup power" }, text: { uk: "Тримає будинок або офіс під час відключень разом з гібридним інвертором.", en: "Keeps a house or office running during outages with a hybrid inverter." }, tone: "navy", links: [
            { label: { uk: "Резерв для будинку", en: "Home backup" }, href: routes.backup.house }, { label: { uk: "Резерв для бізнесу", en: "Business backup" }, href: routes.backup.business },
          ] },
          { icon: "hybrid", tag: { uk: "Автономно", en: "Off-grid" }, title: { uk: "Автономні й гібридні системи", en: "Off-grid and hybrid systems" }, text: { uk: "Основа енергосистеми для об'єктів без стабільної мережі.", en: "The foundation of an energy system for sites without a stable grid." }, tone: "dark", links: [
            { label: { uk: "Розрахувати систему", en: "Calculate a system" }, href: toAnchor(anchors.calculator) }, { label: { uk: "Порівняти накопичувачі", en: "Compare batteries" }, href: toAnchor(anchors.compare) },
          ] },
        ],
      },
      related: ["svitPlus5000", "svitHome", "lithiumvalley"],
      consultation: {
        lead: { uk: "Інженер INIT ENERGY перевірить сумісність з вашим інвертором, підбере кількість батарей і назве вартість під ключ.", en: "An INIT ENERGY engineer will check inverter compatibility, select the number of batteries and quote the turnkey cost." },
        summary: { uk: "SVIT PLUS 16000 · 16,07 кВт·год", en: "SVIT PLUS 16000 · 16.07 kWh" },
        commentPlaceholder: { uk: "Модель вашого інвертора, що потрібно живити", en: "Your inverter model and what needs power" },
      },
    },
    image: {
      src: "/images/products/svit-plus-16000.avif",
      alt: {
        uk: "Батарея SVIT PLUS 16000 під гібридним інвертором на стійці біля стіни приватного будинку",
        en: "SVIT PLUS 16000 battery under a hybrid inverter on a rack by the wall of a private house",
      },
      width: 1448,
      height: 1086,
    },
  },
  {
    id: "lithiumvalley",
    brand: "LITHIUMVALLEY",
    name: "LITHIUMVALLEY",
    href: routes.products.lithiumvalley,
    type: { uk: "BESS", en: "BESS" },
    audience: { uk: "Бізнес", en: "Business" },
    description: {
      uk: "Промислові системи накопичення для підприємств",
      en: "Industrial energy storage for companies",
    },
    focusDescription: {
      uk: "Заводський модуль BESS для підприємств, агро, логістики, медицини й критичної інфраструктури: батареї LiFePO₄ від 208 до 1 044 кВт·год, гібридні інвертори SOLIS 50–125 кВт, рідинне охолодження. Гарантія виробника 10 років. INIT ENERGY — офіційний представник та інсталятор.",
      en: "A factory-built BESS module for industry, agriculture, logistics, healthcare and critical infrastructure: 208 to 1,044 kWh of LiFePO₄ batteries, 50–125 kW SOLIS hybrid inverters and liquid cooling. 10-year manufacturer warranty. INIT ENERGY is the official representative and installer.",
    },
    capacity: { value: 208, unit: "kWh", qualifier: "from" },
    chemistryLabel: { uk: "LiFePO₄ · BESS", en: "LiFePO₄ · BESS" },
    // TODO(content): number of cabinets per configuration (208 / 261 kWh blocks) is not fixed yet.
    focusSpecs: ["minCapacity", "maxCapacity", "cycles"],
    specs: [
      { key: "minCapacity", value: { value: 208, unit: "kWh" } },
      { key: "maxCapacity", value: { value: 1044, unit: "kWh" } },
      {
        key: "cycles",
        value: { value: 8000, unit: "cycles", qualifier: "plus" },
      },
    ],
    segment: { uk: "Бізнес", en: "Business" },
    segmentIcon: "business",
    // TODO(content): nominal voltage, DoD, round-trip efficiency, dimensions,
    // weight, EMS/PCS models, fire agent, certificates and datasheet are absent.
    // TODO(content): clarify the 100 kW PCS option and whether IP54/IP55 applies
    // to the inverter or the full system. Add approved photos and OG artwork.
    page: {
      slug: "bess",
      meta: {
        title: { uk: "LITHIUMVALLEY BESS — накопичення 208–1 044 кВт·год", en: "LITHIUMVALLEY BESS — 208–1,044 kWh energy storage" },
        description: { uk: "Промислова BESS LITHIUMVALLEY на 208–1 044 кВт·год: LiFePO₄, інвертори SOLIS до 125 кВт, перемикання до 10 мс і гарантія 10 років для бізнесу та інфраструктури.", en: "LITHIUMVALLEY industrial BESS from 208 to 1,044 kWh: LiFePO₄, SOLIS inverters up to 125 kW, sub-10 ms transfer and a 10-year warranty for business." },
      },
      hero: {
        typeLabel: { uk: "Промислова система накопичення (BESS)", en: "Industrial battery energy storage system" },
        segmentLabel: { uk: "Бізнес та інфраструктура", en: "Business and infrastructure" },
        lead: { uk: "Промислова система накопичення та резервного живлення на 208–1 044 кВт·год: батареї LiFePO₄, гібридні інвертори SOLIS, керування енергією, рідинне охолодження й пожежогасіння в одному заводському модулі — для приміщення або просто неба.", en: "An industrial 208–1,044 kWh energy storage and backup system combining LiFePO₄ batteries, SOLIS hybrid inverters, energy management, liquid cooling and fire suppression in one factory module for indoor or outdoor installation." },
        keySpecs: [
          { value: { text: { uk: "208–1 044", en: "208–1,044" } }, label: { uk: "кВт·год ємності", en: "kWh capacity" } },
          { value: { text: { uk: "до 125 кВт", en: "up to 125 kW" } }, label: { uk: "гібридний інвертор", en: "hybrid inverter" } },
          { value: { text: { uk: "< 10 мс", en: "< 10 ms" } }, label: { uk: "перемикання", en: "transfer" } },
          { value: { text: { uk: "≥ 8 000", en: "≥ 8,000" } }, label: { uk: "циклів", en: "cycles" } },
        ],
        warranty: { title: { uk: "Гарантія виробника", en: "Manufacturer warranty" }, value: { uk: "10 років", en: "10 years" }, note: { uk: "ресурс конструкції — до 15 років", en: "structure service life up to 15 years" } },
        tags: [{ uk: "Рідинне охолодження", en: "Liquid cooling" }, { uk: "Поставка до 2 тижнів", en: "Delivery within 2 weeks" }],
        secondaryCta: { label: { uk: "Конфігурації", en: "Configurations" }, anchor: "configurations" },
        primaryCta: { uk: "Отримати конфігурацію BESS", en: "Get a BESS configuration" },
        mediaAspect: "square", tagTone: "light",
      },
      advantages: {
        lead: { uk: "Не генератор і не звичайний UPS: система, що накопичує енергію й сама керує її потоками між мережею, СЕС, батареями та навантаженням.", en: "Not a generator or a conventional UPS: a system that stores energy and automatically manages flows between the grid, solar, batteries and loads." },
        items: [
          { icon: "balance", figure: { uk: "< 10 мс", en: "< 10 ms" }, tag: { uk: "Перемикання", en: "Transfer" }, title: { uk: "Миттєве перемикання", en: "Instant transfer" }, text: { uk: "Навантаження переходить на батареї менш ніж за 10 мс — обладнання не помічає відключення.", en: "Loads transfer to batteries in under 10 ms, so equipment does not notice the outage." }, tone: "sky" },
          { icon: "cycles", figure: { uk: "Рідинне", en: "Liquid" }, tag: { uk: "Охолодження", en: "Cooling" }, title: { uk: "Стабільна температура комірок", en: "Stable cell temperature" }, text: { uk: "Рідинне охолодження тримає батареї в робочому режимі й подовжує їхній ресурс.", en: "Liquid cooling keeps batteries at operating temperature and extends service life." }, tone: "light" },
          { icon: "safety", figure: { uk: "2 рівні", en: "2 levels" }, tag: { uk: "Безпека", en: "Safety" }, title: { uk: "Багаторівневе пожежогасіння", en: "Multi-level fire suppression" }, text: { uk: "Окреме пожежогасіння для кожного батарейного блоку і загальне — для всього модуля.", en: "Dedicated suppression for each battery block plus system-wide suppression for the full module." }, tone: "navy" },
          { icon: "scale", figure: { uk: "EMS", en: "EMS" }, tag: { uk: "Керування", en: "Control" }, title: { uk: "Розумне керування й моніторинг", en: "Smart control and monitoring" }, text: { uk: "EMS автоматично розподіляє енергію, а батареї, інвертор і навантаження видно віддалено.", en: "EMS automatically distributes energy while batteries, inverter and load remain visible remotely." }, tone: "dark" },
        ],
      },
      configurations: {
        title: { uk: "Дві базові конфігурації — до 1 044 кВт·год", en: "Two base configurations — up to 1,044 kWh" },
        lead: { uk: "Оберіть базовий модуль під потужність об'єкта й нарощуйте ємність модульно, коли зростає споживання.", en: "Choose a base module for the site's power demand and scale capacity modularly as consumption grows." },
        delivery: { uk: "поставка до 2 тижнів", en: "delivery within 2 weeks" },
        items: [
          { label: { uk: "Конфігурація 01", en: "Configuration 01" }, baseKwh: 208, inverterKw: 50, capacities: [208, 416, 624, 832] },
          { label: { uk: "Конфігурація 02", en: "Configuration 02" }, baseKwh: 261, inverterKw: 125, capacities: [261, 522, 783, 1044] },
        ],
      },
      specs: [],
      specGroups: [
        { title: { uk: "Батарейна система", en: "Battery system" }, rows: [
          { label: { uk: "Хімія", en: "Chemistry" }, value: { text: { uk: "LiFePO₄", en: "LiFePO₄" } } }, { label: { uk: "Модуль", en: "Module" }, value: { text: { uk: "208 / 261 кВт·год", en: "208 / 261 kWh" } } }, { label: { uk: "Масштабування", en: "Scaling" }, value: { text: { uk: "до 1 044 кВт·год", en: "up to 1,044 kWh" } } }, { label: { uk: "Ресурс", en: "Cycle life" }, value: { text: { uk: "≥ 8 000 циклів", en: "≥ 8,000 cycles" } } }, { label: { uk: "Охолодження", en: "Cooling" }, value: { text: { uk: "Рідинне", en: "Liquid" } } }, { label: { uk: "Строк служби конструкції", en: "Structure service life" }, value: { text: { uk: "до 15 років", en: "up to 15 years" } } },
        ] },
        { title: { uk: "Інвертор (PCS)", en: "Inverter (PCS)" }, rows: [
          { label: { uk: "Тип і бренд", en: "Type and brand" }, value: { text: { uk: "Гібридний SOLIS", en: "SOLIS hybrid" } } }, { label: { uk: "Потужність", en: "Power" }, value: { text: { uk: "50 / 100 / 125 кВт", en: "50 / 100 / 125 kW" } } }, { label: { uk: "ККД", en: "Efficiency" }, value: { text: { uk: "до 98–99%", en: "up to 98–99%" } } }, { label: { uk: "Перемикання", en: "Transfer time" }, value: { text: { uk: "< 10 мс", en: "< 10 ms" } } }, { label: { uk: "Джерела", en: "Sources" }, value: { text: { uk: "СЕС і генератор", en: "Solar and generator" } } }, { label: { uk: "Захист", en: "Ingress protection" }, value: { text: { uk: "IP54 / IP55", en: "IP54 / IP55" } } }, { label: { uk: "Температура", en: "Temperature" }, value: { text: { uk: "−20 … +55 °C", en: "−20 … +55 °C" } } }, { label: { uk: "Інтерфейси", en: "Interfaces" }, value: { text: { uk: "CAN, RS485", en: "CAN, RS485" } } },
        ] },
        { title: { uk: "Безпека й керування", en: "Safety and control" }, rows: [
          { label: { uk: "Пожежогасіння", en: "Fire suppression" }, value: { text: { uk: "Модуль + кожен батарейний блок", en: "Module + each battery block" } } }, { label: { uk: "EMS", en: "EMS" }, value: { text: { uk: "Автоматичний розподіл потоків", en: "Automatic energy flow distribution" } } }, { label: { uk: "Моніторинг", en: "Monitoring" }, value: { text: { uk: "Батареї, інвертор і навантаження віддалено", en: "Remote battery, inverter and load monitoring" } } },
        ] },
        { title: { uk: "Гарантія й сервіс", en: "Warranty and service" }, rows: [
          { label: { uk: "Гарантія", en: "Warranty" }, value: { text: { uk: "10 років", en: "10 years" } } }, { label: { uk: "Огляд", en: "Inspection" }, value: { text: { uk: "1–2 рази на рік", en: "1–2 times a year" } } }, { label: { uk: "Діагностика", en: "Diagnostics" }, value: { text: { uk: "Дистанційна", en: "Remote" } } }, { label: { uk: "Монтаж і запуск", en: "Installation and commissioning" }, value: { text: { uk: "від кількох днів до 1–2 тижнів", en: "from a few days to 1–2 weeks" } } },
        ] },
      ],
      specsDevelopmentNotice: { uk: "TODO(content): номінальна напруга, DoD, круговий ККД, габарити, вага, моделі EMS/PCS, тип вогнегасної речовини, сертифікати й datasheet; уточнити 100 кВт та IP54/IP55.", en: "TODO(content): nominal voltage, DoD, round-trip efficiency, dimensions, weight, EMS/PCS models, fire agent, certificates and datasheet; clarify 100 kW and IP54/IP55." },
      applications: {
        variant: "sectors",
        title: { uk: "Для кого LITHIUMVALLEY", en: "Who LITHIUMVALLEY is for" },
        lead: { uk: "Для об'єктів, де відключення зупиняють виробництво, псують продукцію або ставлять під загрозу людей.", en: "For sites where outages stop production, spoil products or put people at risk." },
        items: [
          { icon: "factory", tag: { uk: "Виробництво", en: "Production" }, title: { uk: "Промисловість і агро", en: "Industry and agriculture" }, text: { uk: "", en: "" }, tone: "sky", sectors: [{ uk: "Виробництво", en: "Manufacturing" }, { uk: "Елеватори, ферми, переробка, зрошення", en: "Elevators, farms, processing and irrigation" }, { uk: "Логістика, склади, холодильні комплекси", en: "Logistics, warehouses and cold storage" }, { uk: "Підприємства з піковими навантаженнями", en: "Sites with peak loads" }], links: [{ label: { uk: "Резерв для бізнесу", en: "Business backup" }, href: routes.backup.business }] },
          { icon: "store", tag: { uk: "Комерція", en: "Commercial" }, title: { uk: "Комерція й офіси", en: "Commercial and offices" }, text: { uk: "", en: "" }, tone: "navy", sectors: [{ uk: "Бізнес-центри й офіси", en: "Business centres and offices" }, { uk: "ТРЦ і комерційна нерухомість", en: "Shopping centres and commercial property" }, { uk: "Дата-центри й серверні", en: "Data centres and server rooms" }, { uk: "Об'єкти із СЕС", en: "Sites with solar" }], links: [{ label: { uk: "СЕС для бізнесу", en: "Solar for business" }, href: routes.services.turnkeySes }] },
          { icon: "hybrid", tag: { uk: "Критичні об'єкти", en: "Critical sites" }, title: { uk: "Критична інфраструктура", en: "Critical infrastructure" }, text: { uk: "", en: "" }, tone: "dark", sectors: [{ uk: "Медичні заклади й лабораторії", en: "Medical facilities and laboratories" }, { uk: "Водоканали, насосні й очисні споруди", en: "Water utilities, pumping and treatment plants" }, { uk: "Комунальні об'єкти", en: "Municipal facilities" }, { uk: "Віддалені й автономні об'єкти", en: "Remote and off-grid sites" }], links: [{ label: { uk: "Проєкти для бізнесу", en: "Business projects" }, href: routes.projects }] },
        ],
      },
      process: {
        title: { uk: "Від підбору до запуску — одна команда", en: "One team from selection to commissioning" },
        lead: { uk: "Офіційний представник LITHIUMVALLEY в Україні — INIT ENERGY: проєктуємо, монтуємо й обслуговуємо систему самі.", en: "INIT ENERGY is the official LITHIUMVALLEY representative in Ukraine, designing, installing and servicing the system in-house." },
        steps: [
          { title: { uk: "Підбір рішення", en: "Solution selection" }, text: { uk: "Безкоштовно підбираємо конфігурацію під об'єкт.", en: "We select the site-specific configuration free of charge." } }, { title: { uk: "Проєкт і поставка", en: "Design and delivery" }, text: { uk: "Проєктуємо й постачаємо до 2 тижнів.", en: "We design and deliver within 2 weeks." } }, { title: { uk: "Монтаж і запуск", en: "Installation and commissioning" }, text: { uk: "Від кількох днів до 1–2 тижнів.", en: "From a few days to 1–2 weeks." } }, { title: { uk: "Сервіс", en: "Service" }, text: { uk: "Огляд 1–2 рази на рік і дистанційна діагностика.", en: "Inspection 1–2 times a year and remote diagnostics." } },
        ],
      },
      related: ["svitPlus16000", "svitPlus5000"],
      relatedTitle: { uk: "Менші системи й рішення", en: "Smaller systems and solutions" },
      relatedLinks: [{ title: { uk: "СЕС для бізнесу", en: "Solar for business" }, summary: { uk: "Сонячна електростанція під ключ", en: "Turnkey solar power plant" }, href: routes.services.turnkeySes }],
      consultation: {
        title: { uk: "Отримати конфігурацію BESS", en: "Get a BESS configuration" },
        lead: { uk: "Підбір рішення під конкретний об'єкт — безкоштовно. Інженери INIT ENERGY врахують мережу, СЕС, генератори й реальні режими споживання.", en: "Site-specific solution selection is free. INIT ENERGY engineers account for the grid, solar, generators and real consumption profiles." },
        summary: { uk: "LITHIUMVALLEY BESS · 208–1 044 кВт·год", en: "LITHIUMVALLEY BESS · 208–1,044 kWh" },
        commentPlaceholder: { uk: "Тип об'єкта, пікова потужність, чи є СЕС або генератор", en: "Site type, peak power, existing solar or generator" },
        submit: { uk: "Отримати конфігурацію", en: "Get configuration" },
      },
    },
    image: {
      src: "/images/products/lithiumvalley.avif",
      alt: {
        uk: "Промислова система накопичення енергії LITHIUMVALLEY у шафі з інвертором біля сонячної електростанції",
        en: "LITHIUMVALLEY industrial energy storage system in a cabinet with an inverter next to a solar plant",
      },
      width: 1448,
      height: 1086,
    },
  },
];

export const products = Object.fromEntries(
  productList.map((product) => [product.id, product]),
) as Record<ProductId, Product>;

/** One-line factual summary for menus, built from specs (not hardcoded numbers). */
export function productSummary(id: ProductId, locale: Locale): string {
  const q = (quantity: Quantity) => formatQuantity(quantity, locale);
  const en = locale === "en";

  switch (id) {
    case "svit600":
      return en
        ? `${q({ value: 600, unit: "W" })} station, pure sine wave, ${q(products.svit600.capacity)}`
        : `Станція ${q({ value: 600, unit: "W" })}, чиста синусоїда, ${q(products.svit600.capacity)}`;
    case "svitHome":
      return en
        ? `${q({ value: 6.2, unit: "kW" })} hybrid inverter and ${q(products.svitHome.capacity)} battery`
        : `Гібридний інвертор ${q({ value: 6.2, unit: "kW" })} і АКБ ${q(products.svitHome.capacity)}`;
    case "svitPlus5000":
      return en
        ? `LiFePO₄ ${q(products.svitPlus5000.capacity)}, ${q({ value: 5, unit: "kW" })} power`
        : `LiFePO₄ ${q(products.svitPlus5000.capacity)}, потужність ${q({ value: 5, unit: "kW" })}`;
    case "svitPlus16000":
      return en
        ? `LiFePO₄ ${q(products.svitPlus16000.capacity)} for off-grid systems`
        : `LiFePO₄ ${q(products.svitPlus16000.capacity)} для автономних систем`;
    case "lithiumvalley":
      return en
        ? `Industrial storage from ${formatNumber(208, locale)} to ${q({ value: 1044, unit: "kWh" })}`
        : `Промислове зберігання енергії від ${formatNumber(208, locale)} до ${q({ value: 1044, unit: "kWh" })}`;
  }
}
