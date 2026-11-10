import type { Locale, Quantity } from "@/lib/format";

import { productList, type ProductId } from "./products";
import { routes } from "./routes";

/**
 * Content of full product pages (root-level slugs, e.g. /svit-plus-5000/).
 * Only products listed here get a page; the rest keep their current URL
 * outside this template. Every visible spec, the JSON-LD Product and the
 * FAQ come from here and from products.ts.
 */

type Text = Record<Locale, string>;

/** A spec value: a quantity formatted per locale, or ready text per locale. */
export type SpecValue = { quantity: Quantity } | { text: Text };

export type SpecRow = { label: Text; value: SpecValue };

export type AdvantageIcon =
  | "safety"
  | "balance"
  | "cycles"
  | "scale"
  | "kit"
  | "mobility"
  | "solar";
export type ApplicationIcon =
  | "house"
  | "store"
  | "factory"
  | "solar"
  | "backup"
  | "hybrid";
export type CompositionModeIcon = "backup" | "solar" | "grid";

/** Slugs of products that have a full page (also FAQ page keys). */
export type ProductPageSlug = "svit-plus-5000" | "svit-home" | "svit-plus-16000" | "bess";

export type ProductPage = {
  id: ProductId;
  /** Root-level slug, also used as the lead form's hidden product field. */
  slug: ProductPageSlug;
  meta: { title: Text; description: Text };
  /** Share image, JPEG 1200×630 (social networks do not show AVIF). */
  ogImage?: string;
  hero: {
    typeLabel: Text;
    segmentLabel: Text;
    lead: Text;
    keySpecs: { value: SpecValue; label: Text }[];
    warranty: { title: Text; value: Text; note: Text };
    tags: Text[];
    secondaryCta?: { label: Text; anchor: "composition" | "inside" | "configurations" | "specs" };
    segmentIcon?: "house" | "sun";
    mediaAspect?: "landscape" | "square";
    tagTone?: "dark" | "light";
    primaryCta?: Text;
  };
  /** Use placeholders on the full page even if the catalogue has an image. */
  mediaPlaceholder?: boolean;
  specsMediaAspect?: "landscape" | "portrait";
  advantages: {
    lead: Text;
    items: {
      icon: AdvantageIcon;
      /** Big figure at the top of the card (formatted text). */
      figure: Text;
      tag: Text;
      title: Text;
      text: Text;
      tone: "sky" | "light" | "navy" | "dark";
    }[];
  };
  specs: SpecRow[];
  specGroups?: { title: Text; rows: SpecRow[] }[];
  specsDevelopmentNotice?: Text;
  /** TODO(content): datasheet PDF URL; the link renders only when set. */
  datasheetUrl?: string;
  scaling?: {
    title: Text;
    lead: Text;
    moduleCapacityKwh: number;
    options: number[];
    defaultModules: number;
  };
  composition?: {
    title: Text;
    lead: Text;
    items: {
      title: Text;
      text: Text;
      specs: { label: Text; value: Text }[];
      /** Photo of the component; without it the card shows a placeholder. */
      image?: { src: string; alt: Text };
      relatedProduct?: ProductId;
      linkLabel?: Text;
    }[];
    modesTitle: Text;
    modesEyebrow: Text;
    modes: {
      icon: CompositionModeIcon;
      title: Text;
      text: Text;
    }[];
  };
  inside?: {
    title: Text;
    lead: Text;
    cellBrand: string;
    cellCount: number;
    cellCapacityAh: number;
    configuration: string;
    voltage: Text;
    stats: { value: Text; label: Text }[];
    bms: { title: Text; lead: Text; protections: Text[] };
    compatibility: { title: Text; lead: Text; brands: Text[] };
  };
  configurations?: {
    title: Text; lead: Text; delivery: Text;
    items: { label: Text; baseKwh: number; inverterKw: number; capacities: number[] }[];
  };
  process?: {
    title: Text; lead: Text;
    steps: { title: Text; text: Text }[];
  };
  applications: {
    title?: Text;
    lead: Text;
    variant?: "cards" | "sectors";
    items: {
      icon: ApplicationIcon;
      tag: Text;
      title: Text;
      text: Text;
      tone: "sky" | "navy" | "dark";
      links: { label: Text; href: string }[];
      sectors?: Text[];
    }[];
  };
  related: ProductId[];
  relatedTitle?: Text;
  relatedLinks?: { title: Text; summary: Text; href: string }[];
  consultation: { title?: Text; lead: Text; summary?: Text; commentPlaceholder?: Text; submit?: Text };
};

export type ProductPageContent = Omit<ProductPage, "id">;

const standaloneProductPages: ProductPage[] = [
  {
    id: "svitPlus5000",
    slug: "svit-plus-5000",
    ogImage: "/images/og/svit-plus-5000.jpg",
    meta: {
      title: {
        uk: "SVIT PLUS 5000 — батарея LiFePO₄ 5,12 кВт·год",
        en: "SVIT PLUS 5000 — 5.12 kWh LiFePO₄ battery",
      },
      description: {
        uk: "Батарея SVIT PLUS 5000 LiFePO₄ 48 В на 5,12 кВт·год: понад 10 000 циклів, до 16 модулів паралельно (81 кВт·год), гарантія 5 років. Для дому й бізнесу.",
        en: "SVIT PLUS 5000 48 V LiFePO₄ battery, 5.12 kWh: over 10,000 cycles, up to 16 modules in parallel (81 kWh), 5-year warranty. For homes and businesses.",
      },
    },
    hero: {
      typeLabel: {
        uk: "Акумуляторна батарея LiFePO₄",
        en: "LiFePO₄ battery",
      },
      segmentLabel: { uk: "Дім і бізнес", en: "Home and business" },
      lead: {
        uk: "Літій-залізо-фосфатна батарея на 5,12 кВт·год і 5 кВт для дому, малого бізнесу й промислових об'єктів. Працює з сонячним або гібридним інвертором — живить обладнання під час відключень і пікових навантажень.",
        en: "A 5.12 kWh, 5 kW lithium iron phosphate battery for homes, small businesses and industrial sites. It works with a solar or hybrid inverter and powers equipment during outages and load peaks.",
      },
      keySpecs: [
        {
          value: { quantity: { value: 5.12, unit: "kWh" } },
          label: { uk: "ємність", en: "capacity" },
        },
        {
          value: { quantity: { value: 5, unit: "kW" } },
          label: { uk: "потужність", en: "power" },
        },
        {
          value: { quantity: { value: 48, unit: "V" } },
          label: { uk: "номінальна напруга", en: "nominal voltage" },
        },
        {
          value: { text: { uk: "10 000+", en: "10,000+" } },
          label: { uk: "циклів", en: "cycles" },
        },
      ],
      warranty: {
        title: { uk: "Офіційна гарантія", en: "Official warranty" },
        value: { uk: "5 років", en: "5 years" },
        note: { uk: "з можливістю продовження", en: "extendable" },
      },
      tags: [
        { uk: "RS485 / CAN", en: "RS485 / CAN" },
        { uk: "Стіна або підлога", en: "Wall or floor" },
      ],
    },
    advantages: {
      lead: {
        uk: "Батарея для тих, кому потрібне надійне живлення роками: безпечна хімія, контроль кожної комірки й запас для розширення.",
        en: "A battery for those who need reliable power for years: safe chemistry, control of every cell and room to expand.",
      },
      items: [
        {
          icon: "safety",
          figure: { uk: "LiFePO₄", en: "LiFePO₄" },
          tag: { uk: "Безпека", en: "Safety" },
          title: { uk: "Безпечна хімія", en: "Safe chemistry" },
          text: {
            uk: "Літій-залізо-фосфат стабільний при нагріванні; батарея має захист від перегріву й перевантаження.",
            en: "Lithium iron phosphate stays stable when heated; the battery is protected against overheating and overload.",
          },
          tone: "sky",
        },
        {
          icon: "balance",
          figure: { uk: "±", en: "±" },
          tag: { uk: "Балансування", en: "Balancing" },
          title: { uk: "Активне балансування", en: "Active balancing" },
          text: {
            uk: "Система вирівнює заряд комірок між собою — це подовжує строк служби батареї.",
            en: "The system evens out the charge between cells, which extends the battery's service life.",
          },
          tone: "light",
        },
        {
          icon: "cycles",
          figure: { uk: "10 000+", en: "10,000+" },
          tag: { uk: "Ресурс", en: "Lifetime" },
          title: { uk: "Понад 10 000 циклів", en: "Over 10,000 cycles" },
          text: {
            uk: "Батарея витримує понад 10 000 циклів заряду й розряду — ресурс на роки експлуатації.",
            en: "The battery withstands over 10,000 charge and discharge cycles — a lifetime of years of use.",
          },
          tone: "navy",
        },
        {
          icon: "scale",
          figure: { uk: "81", en: "81" },
          tag: { uk: "Масштаб", en: "Scale" },
          title: { uk: "До 81 кВт·год", en: "Up to 81 kWh" },
          text: {
            uk: "До 16 модулів паралельно — систему можна почати з однієї батареї й розширити пізніше.",
            en: "Up to 16 modules in parallel — start with one battery and expand later.",
          },
          tone: "dark",
        },
      ],
    },
    specs: [
      {
        label: { uk: "Тип батареї", en: "Battery type" },
        value: {
          text: {
            uk: "LiFePO₄ (літій-залізо-фосфатна)",
            en: "LiFePO₄ (lithium iron phosphate)",
          },
        },
      },
      {
        label: { uk: "Номінальна ємність", en: "Nominal capacity" },
        value: { text: { uk: "5,12 кВт·год (100 Аг)", en: "5.12 kWh (100 Ah)" } },
      },
      {
        label: { uk: "Номінальна потужність", en: "Nominal power" },
        value: { quantity: { value: 5, unit: "kW" } },
      },
      {
        label: { uk: "Номінальна напруга", en: "Nominal voltage" },
        value: { quantity: { value: 48, unit: "V" } },
      },
      {
        label: { uk: "Кількість циклів", en: "Cycle life" },
        value: { text: { uk: "понад 10 000", en: "over 10,000" } },
      },
      {
        label: { uk: "Паралельне підключення", en: "Parallel connection" },
        value: {
          text: {
            uk: "до 16 модулів, до 81 кВт·год",
            en: "up to 16 modules, up to 81 kWh",
          },
        },
      },
      {
        label: { uk: "Габарити", en: "Dimensions" },
        value: { text: { uk: "442 × 420 × 132 мм", en: "442 × 420 × 132 mm" } },
      },
      {
        label: { uk: "Вага", en: "Weight" },
        value: { text: { uk: "≈ 45 кг", en: "≈ 45 kg" } },
      },
      {
        label: { uk: "Робоча температура", en: "Operating temperature" },
        value: { text: { uk: "−10 … +50 °C", en: "−10 … +50 °C" } },
      },
      {
        label: { uk: "Інтерфейси", en: "Interfaces" },
        value: {
          text: {
            uk: "RS485 / CAN — зв'язок з інвертором",
            en: "RS485 / CAN — inverter communication",
          },
        },
      },
      {
        label: { uk: "Монтаж", en: "Mounting" },
        value: {
          text: { uk: "Настінний або підлоговий", en: "Wall or floor" },
        },
      },
      {
        label: { uk: "Гарантія", en: "Warranty" },
        value: {
          text: {
            uk: "5 років, з можливістю продовження",
            en: "5 years, extendable",
          },
        },
      },
    ],
    scaling: {
      title: {
        uk: "Від 5 до 81 кВт·год — коли потрібно більше",
        en: "From 5 to 81 kWh — when you need more",
      },
      lead: {
        uk: "Почніть з однієї батареї, а коли зросте споживання — додайте модулі паралельно. Нова система не потрібна.",
        en: "Start with one battery and add modules in parallel as consumption grows. No new system needed.",
      },
      moduleCapacityKwh: 5.12,
      options: [1, 2, 4, 8, 16],
      defaultModules: 4,
    },
    applications: {
      lead: {
        uk: "Одна батарея закриває резерв для дому, а кілька модулів — для бізнесу й критичних об'єктів.",
        en: "One battery covers backup for a home; several modules cover businesses and critical sites.",
      },
      // Pages for backup power / solar per segment do not exist yet: links go to the
      // closest existing pages (SVIT HOME, turnkey solar, LITHIUMVALLEY).
      items: [
        {
          icon: "house",
          tag: { uk: "Дім", en: "Home" },
          title: { uk: "Приватний будинок", en: "Private house" },
          text: {
            uk: "Живлення побутової техніки, інтернету, освітлення й опалення під час відключень.",
            en: "Power for appliances, internet, lighting and heating during outages.",
          },
          tone: "sky",
          links: [
            {
              label: {
                uk: "Комплекс SVIT HOME для будинку",
                en: "SVIT HOME kit for a house",
              },
              href: routes.products.svitHome,
            },
            {
              label: { uk: "СЕС під ключ", en: "Turnkey solar plant" },
              href: routes.services.turnkeySes,
            },
          ],
        },
        {
          icon: "store",
          tag: { uk: "Малий бізнес", en: "Small business" },
          title: { uk: "Офіси, кафе, магазини", en: "Offices, cafés, shops" },
          text: {
            uk: "Каси, освітлення, холодильне обладнання й зв'язок працюють без перебоїв.",
            en: "Tills, lighting, refrigeration and communications keep running without interruption.",
          },
          tone: "navy",
          links: [
            {
              label: {
                uk: "СЕС під ключ для бізнесу",
                en: "Turnkey solar for business",
              },
              href: routes.services.turnkeySes,
            },
            {
              label: { uk: "СЕС для готелю", en: "Solar for hotels" },
              href: routes.solutions.hotelSes,
            },
          ],
        },
        {
          icon: "factory",
          tag: { uk: "Промисловість", en: "Industry" },
          title: {
            uk: "Виробництво й критичні об'єкти",
            en: "Production and critical sites",
          },
          text: {
            uk: "Кілька модулів паралельно — для серверних, ліній виробництва й критичної інфраструктури.",
            en: "Several modules in parallel — for server rooms, production lines and critical infrastructure.",
          },
          tone: "dark",
          links: [
            {
              label: {
                uk: "LITHIUMVALLEY для великих систем",
                en: "LITHIUMVALLEY for large systems",
              },
              href: routes.products.lithiumvalley,
            },
          ],
        },
      ],
    },
    related: ["svitHome", "svitPlus16000", "lithiumvalley"],
    consultation: {
      lead: {
        uk: "Інженер INIT ENERGY підбере кількість модулів SVIT PLUS 5000 і інвертор під ваше споживання та назве вартість під ключ.",
        en: "An INIT ENERGY engineer will choose the number of SVIT PLUS 5000 modules and the inverter for your consumption and quote the turnkey price.",
      },
    },
  },
];

/** Full pages declared on products plus legacy page data being migrated. */
export const productPages: ProductPage[] = [
  ...standaloneProductPages,
  ...productList.flatMap((product) =>
    product.page ? [{ id: product.id, ...product.page }] : [],
  ),
];

export function productPageBySlug(slug: string): ProductPage | undefined {
  return productPages.find((page) => page.slug === slug);
}
