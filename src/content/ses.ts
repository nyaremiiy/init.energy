import type { Localized } from "@/i18n/config";

/**
 * Facts and copy of the solar power plant hub (/ses/) that are not in
 * company.ts or solutions.ts. Everything here is a general description of
 * plant types; verify with the owner before publishing.
 */

export type PlantTypeId = "grid" | "hybrid" | "off";

export const plantTypes: { id: PlantTypeId; label: Localized }[] = [
  { id: "grid", label: { uk: "Мережева", en: "Grid-tied" } },
  { id: "hybrid", label: { uk: "Гібридна", en: "Hybrid" } },
  { id: "off", label: { uk: "Автономна", en: "Off-grid" } },
];

// TODO(content): owner to confirm the comparison rows (general facts, not from init.energy).
export const plantRows: {
  label: Localized;
  /** `true` / `false` render as check / cross icons. */
  values: Record<PlantTypeId, boolean | Localized>;
}[] = [
  {
    label: { uk: "Працює під час відключення", en: "Works during outages" },
    values: { grid: false, hybrid: true, off: true },
  },
  {
    label: { uk: "Потрібен накопичувач", en: "Needs a battery" },
    values: { grid: false, hybrid: true, off: true },
  },
  {
    label: {
      uk: "Віддає надлишки в мережу",
      en: "Feeds surplus into the grid",
    },
    values: { grid: true, hybrid: true, off: false },
  },
  {
    label: { uk: "Залежність від мережі", en: "Dependence on the grid" },
    values: {
      grid: { uk: "повна", en: "full" },
      hybrid: { uk: "часткова", en: "partial" },
      off: { uk: "немає", en: "none" },
    },
  },
  {
    label: { uk: "Кому підходить", en: "Best for" },
    values: {
      grid: {
        uk: "економія там, де світло стабільне",
        en: "savings where the grid is stable",
      },
      hybrid: {
        uk: "будинки й бізнес з відключеннями",
        en: "homes and businesses facing outages",
      },
      off: {
        uk: "об'єкти без підключення до мережі",
        en: "sites with no grid connection",
      },
    },
  },
];

export const hybridFlow: {
  id: "panels" | "inverter" | "battery" | "house";
  title: Localized;
  text: Localized;
  highlight?: boolean;
}[] = [
  {
    id: "panels",
    title: { uk: "Сонячні панелі", en: "Solar panels" },
    text: {
      uk: "Виробляють електроенергію, поки є сонце.",
      en: "Generate electricity while the sun shines.",
    },
  },
  {
    id: "inverter",
    title: { uk: "Інвертор", en: "Inverter" },
    text: {
      uk: "Перетворює струм і керує потоками між панелями, батареєю, будинком і мережею.",
      en: "Converts the current and manages flows between panels, battery, house and grid.",
    },
  },
  {
    id: "battery",
    title: { uk: "Накопичувач SVIT", en: "SVIT battery" },
    text: {
      uk: "Запасає надлишки на вечір і на час відключень.",
      en: "Stores the surplus for the evening and for outages.",
    },
    highlight: true,
  },
  {
    id: "house",
    title: { uk: "Будинок і мережа", en: "House and grid" },
    text: {
      uk: "Живить прилади; надлишок може йти в мережу, якщо це дозволяє схема.",
      en: "Powers appliances; surplus can go to the grid if the scheme allows.",
    },
  },
];

// TODO(content): durations of each step (days or weeks) are not confirmed.
export const buildSteps: { title: Localized; text: Localized }[] = [
  {
    title: { uk: "Розрахунок споживання", en: "Consumption estimate" },
    text: {
      uk: "Рахуємо, скільки енергії потрібно будинку або бізнесу.",
      en: "We work out how much energy the house or business needs.",
    },
  },
  {
    title: { uk: "Проєкт і конфігурація", en: "Design and configuration" },
    text: {
      uk: "Підбираємо потужність панелей, інвертор і накопичувач.",
      en: "We choose the panel power, inverter and battery.",
    },
  },
  {
    title: { uk: "Кошторис під ключ", en: "Turnkey quote" },
    text: {
      uk: "Називаємо вартість обладнання, монтажу й запуску однією сумою.",
      en: "We quote equipment, installation and commissioning as one sum.",
    },
  },
  {
    title: { uk: "Монтаж і запуск", en: "Installation and commissioning" },
    text: {
      uk: "Встановлюємо обладнання та запускаємо систему.",
      en: "We install the equipment and commission the system.",
    },
  },
  {
    title: { uk: "Сервіс і гарантія", en: "Service and warranty" },
    text: {
      uk: "Супроводжуємо станцію після запуску.",
      en: "We support the plant after commissioning.",
    },
  },
];

// TODO(content): articles «Корисне перед покупкою СЕС» — topics: how to choose SES power
// for a house; grid-tied vs hybrid; how many panels for 5 and 10 kW; payback for business.
// The section renders only when at least 3 articles exist in content/articles/.
