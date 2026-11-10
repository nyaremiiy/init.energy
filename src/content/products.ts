import type { Locale, Localized } from "@/i18n/config";
import { formatNumber, formatQuantity, type Quantity } from "@/lib/format";

import { routes } from "./routes";
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
  /** Rows of the product card spec list. */
  specs: ProductSpec[];
  /** Segment label shown on the product card. */
  segment: Localized;
  segmentIcon: SegmentIconId;
  image?: ProductImage;
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
      uk: "Готовий комплект для будинку й малого бізнесу: гібридний інвертор 6 кВт і батарея SVIT PLUS 5000 на 5,12 кВт·год на мобільній стійці з колесами — без настінного монтажу. Під час відключення сам переходить на батарею, а з панелями працює як сонячна станція.",
      en: "A ready kit for a house or small business: a 6 kW hybrid inverter and a 5.12 kWh SVIT PLUS 5000 battery on a mobile rack with wheels — no wall mounting. It switches to the battery by itself during an outage and works as a solar plant with panels.",
    },
    capacity: { value: 5.12, unit: "kWh" },
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "inverter", value: { value: 6, unit: "kW" } },
      {
        key: "cycles",
        value: { value: 6000, unit: "cycles", qualifier: "plus" },
      },
    ],
    segment: { uk: "Приватний будинок", en: "Private house" },
    segmentIcon: "house",
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
    specs: [
      { key: "capacity", value: { value: 5.12, unit: "kWh" } },
      { key: "power", value: { value: 5, unit: "kW" } },
      {
        key: "cycles",
        value: { value: 6000, unit: "cycles", qualifier: "plus" },
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
        ? `${q({ value: 6, unit: "kW" })} hybrid inverter and ${q(products.svitHome.capacity)} battery`
        : `Гібридний інвертор ${q({ value: 6, unit: "kW" })} і АКБ ${q(products.svitHome.capacity)}`;
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
