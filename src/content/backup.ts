import type { Localized } from "@/i18n/config";

import { appliances } from "./appliances";
import { products, type ProductId } from "./products";
import { routes } from "./routes";
import type { SegmentIconId } from "./segments";

/**
 * Backup power hub (/rezervne-zhyvlennya/). Page data only; UI texts live in
 * messages/*.json under `backup`. Owner's mockup 2026-11-18.
 *
 * Not published until the owner confirms (TODO(content)):
 * - «Власне виробництво в Україні» for the whole SVIT line (confirmed only for SVIT PLUS 5000 and SVIT HOME);
 * - «Гарантія напряму від виробника»;
 * - whether SVIT batteries connect to Deye / Victron / Huawei inverters, and servicing systems installed by others
 *   (the «Вже маєте систему іншого бренду?» strip and the FAQ question are left out).
 */

export const backupHeroImage = {
  desktop: "/images/rezervne-zhyvlennya/hero-2560.avif",
  laptop: "/images/rezervne-zhyvlennya/hero-1440.avif",
  tablet: "/images/rezervne-zhyvlennya/hero-1280.avif",
  mobile: "/images/rezervne-zhyvlennya/hero-750.avif",
  wide: "/images/rezervne-zhyvlennya/hero-1920.avif",
  alt: {
    uk: "Інвертор, накопичувач і щиток системи резервного живлення на стіні гаража",
    en: "An inverter, a battery and a switchboard of a backup power system on a garage wall",
  } satisfies Localized,
};

/** A check row on a segment card: plain text, a product brief from products.ts, or product names. */
export type SegmentCheck =
  | { text: Localized }
  | { brief: ProductId }
  | { names: ProductId[] };

export type BackupSegment = {
  id: "apartment" | "house" | "business";
  icon: SegmentIconId;
  label: Localized;
  title: Localized;
  text: Localized;
  checks: SegmentCheck[];
  /** Planned segment page (renders «в розробці» until it is built). */
  href: string;
  image: { src: string; alt: Localized; position?: "top" };
};

export const backupSegments: BackupSegment[] = [
  {
    id: "apartment",
    icon: "apartment",
    label: { uk: "Квартира", en: "Apartment" },
    title: { uk: "Для квартири", en: "For an apartment" },
    text: {
      uk: "Світло, зв'язок і холодильник без шуму й вихлопу.",
      en: "Lights, internet and the fridge without noise or fumes.",
    },
    checks: [
      { text: { uk: "Роутер, світло, ноутбук", en: "Router, lights, laptop" } },
      { text: { uk: "SVIT 600 — без монтажу", en: "SVIT 600 — no installation" } },
      // The mockup said «вбудована система»; SVIT HOME is a free-standing kit (no wall mounting).
      { text: { uk: "SVIT HOME — комплект з інвертором", en: "SVIT HOME — kit with an inverter" } },
    ],
    href: routes.backup.apartment,
    image: {
      src: "/images/rezervne-zhyvlennya/segment-apartment-1280.avif",
      alt: {
        uk: "Інвертор і накопичувач на стіні сучасної квартири",
        en: "An inverter and a battery on the wall of a modern apartment",
      },
    },
  },
  {
    id: "house",
    icon: "house",
    label: { uk: "Будинок", en: "House" },
    title: { uk: "Для приватного будинку", en: "For a private house" },
    text: {
      uk: "Котел, насос і холодильник працюють, поки немає мережі.",
      en: "The boiler, pump and fridge keep running while the grid is down.",
    },
    checks: [
      { text: { uk: "Котел, насос, холодильник", en: "Boiler, pump, fridge" } },
      { brief: "svitHome" },
      { text: { uk: "Можна додати сонячні панелі", en: "Solar panels can be added" } },
    ],
    href: routes.backup.house,
    image: {
      src: "/images/home/promo/ses-roof-1920.avif",
      alt: {
        uk: "Сонячні панелі на даху приватного будинку на заході сонця",
        en: "Solar panels on the roof of a private house at sunset",
      },
    },
  },
  {
    id: "business",
    icon: "business",
    label: { uk: "Бізнес", en: "Business" },
    title: { uk: "Для бізнесу", en: "For business" },
    text: {
      uk: "Каси, сервери й обладнання працюють без зупинки.",
      en: "Tills, servers and equipment keep running without a stop.",
    },
    checks: [
      { text: { uk: "Розрахунок під навантаження", en: "Sized for your load" } },
      { names: ["svitPlus16000", "lithiumvalley"] },
      { text: { uk: "Або системи Deye, Victron, Huawei", en: "Or Deye, Victron, Huawei systems" } },
    ],
    href: routes.backup.business,
    image: {
      src: "/images/rezervne-zhyvlennya/segment-business-1280.avif",
      alt: {
        uk: "Сонячні панелі на даху промислового підприємства",
        en: "Solar panels on the roof of an industrial plant",
      },
    },
  },
];

/** How backup power works: grid → outage → grid back. The outage step is highlighted. */
export const backupFlow: { id: "grid" | "outage" | "restored"; title: Localized; text: Localized; highlight?: boolean }[] = [
  {
    id: "grid",
    title: { uk: "Є мережа", en: "Grid is on" },
    text: {
      uk: "Прилади працюють від мережі, батарея заряджається й чекає.",
      en: "Appliances run from the grid; the battery charges and waits.",
    },
  },
  {
    id: "outage",
    highlight: true,
    title: { uk: "Відключення", en: "Outage" },
    text: {
      uk: "Інвертор автоматично перемикає живлення на накопичувач.",
      en: "The inverter switches the power to the battery automatically.",
    },
  },
  {
    id: "restored",
    title: { uk: "Мережа повернулась", en: "Grid is back" },
    text: {
      uk: "Система знову живить прилади від мережі й заряджає батарею.",
      en: "The system powers the appliances from the grid again and recharges the battery.",
    },
  },
];

/** Partner brands we sell, install and service (owner's mockup), shown as text. */
export const backupBrands = ["Deye", "Victron", "Huawei"] as const;

/** SVIT line shown on the equipment card (INIT ENERGY's own brand). */
export const svitLine: ProductId[] = ["svit600", "svitHome", "svitPlus5000", "svitPlus16000"];

/** Usable share of the nominal capacity (typical depth of discharge for LiFePO₄). */
export const usableShare = 0.9;

export type LoadSet = {
  id: "basic" | "fridge" | "house";
  label: Localized;
  appliances: string[];
  /** Shown instead of hours when the load exceeds the product's output. */
  overload: Localized;
};

export const backupLoadSets: LoadSet[] = [
  {
    id: "basic",
    label: { uk: "Роутер, світло, ноутбук", en: "Router, lights, laptop" },
    appliances: ["router", "lights", "laptop"],
    overload: { uk: "перевищує потужність", en: "exceeds the output" },
  },
  {
    id: "fridge",
    label: { uk: "+ холодильник", en: "+ fridge" },
    appliances: ["router", "lights", "laptop", "fridge"],
    overload: { uk: "перевищує потужність", en: "exceeds the output" },
  },
  {
    id: "house",
    label: {
      uk: "Будинок: котел, холодильник, світло, роутер, насос",
      en: "House: boiler, fridge, lights, router, pump",
    },
    appliances: ["boiler", "fridge", "lights", "router", "pump"],
    overload: { uk: "не потягне насос", en: "cannot run the pump" },
  },
];

/** Total power of a load set from content/appliances.ts. */
export function loadSetPowerW(set: LoadSet): number {
  return set.appliances.reduce((sum, id) => sum + (appliances.find((item) => item.id === id)?.powerW ?? 0), 0);
}

/** Products in the autonomy table; SVIT PLUS 16000 works with a separate hybrid inverter. */
export const backupRuntimeProducts: { id: ProductId; withInverter?: boolean }[] = [
  { id: "svit600" },
  { id: "svitHome" },
  { id: "svitPlus16000", withInverter: true },
];

/** Nominal capacity in Wh. */
export function capacityWh(id: ProductId): number {
  const capacity = products[id].capacity;
  return capacity.unit === "kWh" ? capacity.value * 1000 : capacity.value;
}

/** Output limit in W: the station's power or the kit's inverter; none for a bare battery. */
export function outputLimitW(id: ProductId): number | undefined {
  const spec = products[id].specs.find((item) => item.key === "power" || item.key === "inverter");
  const value = spec && typeof spec.value === "object" && "unit" in spec.value ? spec.value : undefined;
  if (!value) return undefined;
  if (value.unit === "kW") return value.value * 1000;
  if (value.unit === "W") return value.value;
  return undefined;
}

export type CompareStatus = "good" | "limited" | "bad";
export type CompareColumnId = "generator" | "ups" | "battery";

export const backupCompareColumns: { id: CompareColumnId; label: Localized; highlight?: boolean }[] = [
  { id: "generator", label: { uk: "Генератор", en: "Generator" } },
  { id: "ups", label: { uk: "ДБЖ (UPS)", en: "UPS" } },
  { id: "battery", label: { uk: "Інвертор + накопичувач", en: "Inverter + battery" }, highlight: true },
];

export type CompareRowId = "noise" | "switching" | "runtime" | "maintenance" | "apartment" | "solar";

export const backupCompareRows: { id: CompareRowId; label: Localized; cells: Record<CompareColumnId, { status: CompareStatus; text: Localized }> }[] = [
  {
    id: "noise",
    label: { uk: "Шум і вихлоп", en: "Noise and fumes" },
    cells: {
      generator: { status: "bad", text: { uk: "є", en: "yes" } },
      ups: { status: "good", text: { uk: "немає", en: "none" } },
      battery: { status: "good", text: { uk: "немає", en: "none" } },
    },
  },
  {
    id: "switching",
    label: { uk: "Перемикання при відключенні", en: "Switching during an outage" },
    cells: {
      generator: { status: "limited", text: { uk: "запуск вручну або через АВР", en: "manual start or via an ATS" } },
      ups: { status: "good", text: { uk: "автоматично", en: "automatic" } },
      battery: { status: "good", text: { uk: "автоматично", en: "automatic" } },
    },
  },
  {
    id: "runtime",
    label: { uk: "Скільки працює", en: "How long it runs" },
    cells: {
      generator: { status: "limited", text: { uk: "поки є паливо", en: "while there is fuel" } },
      ups: { status: "bad", text: { uk: "хвилини — кілька годин", en: "minutes to a few hours" } },
      battery: { status: "good", text: { uk: "години — доба і більше", en: "hours to a day or more" } },
    },
  },
  {
    id: "maintenance",
    label: { uk: "Обслуговування", en: "Maintenance" },
    cells: {
      generator: { status: "bad", text: { uk: "масло, паливо, запуск", en: "oil, fuel, starting" } },
      ups: { status: "limited", text: { uk: "заміна акумуляторів", en: "battery replacement" } },
      battery: { status: "good", text: { uk: "мінімальне", en: "minimal" } },
    },
  },
  {
    id: "apartment",
    label: { uk: "Для квартири", en: "For an apartment" },
    cells: {
      generator: { status: "bad", text: { uk: "ні", en: "no" } },
      ups: { status: "good", text: { uk: "так", en: "yes" } },
      battery: { status: "good", text: { uk: "так", en: "yes" } },
    },
  },
  {
    id: "solar",
    label: { uk: "Заряд від сонячних панелей", en: "Charging from solar panels" },
    cells: {
      generator: { status: "bad", text: { uk: "ні", en: "no" } },
      ups: { status: "bad", text: { uk: "ні", en: "no" } },
      battery: { status: "good", text: { uk: "так, з гібридним інвертором", en: "yes, with a hybrid inverter" } },
    },
  },
];

/** How we install backup power: five stages (adapted from content/ses.ts buildSteps). */
export const backupSteps: { title: Localized; text: Localized }[] = [
  {
    title: { uk: "Розрахунок навантаження", en: "Load calculation" },
    text: {
      uk: "Визначаємо, що має працювати без мережі і скільки годин.",
      en: "We work out what has to run without the grid and for how many hours.",
    },
  },
  {
    title: { uk: "Підбір системи", en: "System selection" },
    text: {
      uk: "Накопичувач SVIT або система на Deye, Victron, Huawei — під ваші прилади.",
      en: "An SVIT battery or a Deye, Victron or Huawei system — matched to your appliances.",
    },
  },
  {
    title: { uk: "Кошторис під ключ", en: "Turnkey estimate" },
    text: {
      uk: "Обладнання, монтаж і запуск однією сумою.",
      en: "Equipment, installation and commissioning in one price.",
    },
  },
  {
    title: { uk: "Монтаж і запуск", en: "Installation and start-up" },
    text: {
      uk: "Встановлюємо обладнання, підключаємо до щита й запускаємо систему.",
      en: "We install the equipment, connect it to the switchboard and start the system.",
    },
  },
  {
    title: { uk: "Сервіс і гарантія", en: "Service and warranty" },
    text: {
      uk: "Супроводжуємо систему після запуску.",
      en: "We look after the system after start-up.",
    },
  },
];
