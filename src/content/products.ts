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
    // Hero photo is in place; kit, inverter and battery photos are still TODO(content).
    // TODO(content): add system voltage, dimensions, weight, interfaces,
    // inverter warranty and datasheet PDF when the owner confirms them.
    // Until then these rows and links are intentionally absent.
    page: {
      slug: "svit-home",
      meta: {
        title: {
          uk: "SVIT HOME — резервне живлення 6,2 кВт, 5,12 кВт·год",
          en: "SVIT HOME — 6.2 kW, 5.12 kWh backup power kit",
        },
        description: {
          uk: "SVIT HOME — готовий комплект резервного живлення: гібридний інвертор VICTOR 6,2 кВт, батарея LiFePO₄ 5,12 кВт·год і стійка на ніжках для квартир, будинків, ОСББ та підприємств.",
          en: "SVIT HOME is a ready backup power kit with a 6.2 kW VICTOR hybrid inverter, a 5.12 kWh LiFePO₄ battery and a rack on legs for apartments, houses, housing associations and businesses.",
        },
      },
      ogImage: "/images/og/svit-home.jpg",
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
              { label: { uk: "СЕС для дому", en: "Solar for a house" }, href: routes.services.solar },
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
              { label: { uk: "СЕС для бізнесу", en: "Solar for business" }, href: routes.services.solar },
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
