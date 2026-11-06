import { messages } from "./messages";

export type Locale = "uk" | "en";

const intlLocales: Record<Locale, string> = {
  uk: "uk-UA",
  en: "en-US",
};

export type Unit = "W" | "kW" | "Wh" | "kWh" | "cycles";

export type Quantity = {
  value: number;
  unit: Unit;
  /** "from" → «від 208 кВт·год», "upTo" → «до 1044 кВт·год», "plus" → «6000+ циклів». */
  qualifier?: "from" | "upTo" | "plus";
};

export function formatNumber(value: number, locale: Locale = "uk") {
  return new Intl.NumberFormat(intlLocales[locale], {
    maximumFractionDigits: 2,
  }).format(value);
}

// Ukrainian only for now; pass the locale's messages once i18n lands.
export function formatQuantity(quantity: Quantity, locale: Locale = "uk") {
  const { units, quantity: templates } = messages;
  const number = formatNumber(quantity.value, locale);
  const value =
    quantity.qualifier === "plus"
      ? templates.plus.replace("{value}", number)
      : number;
  const withUnit = `${value} ${units[quantity.unit]}`;

  if (quantity.qualifier === "from") {
    return templates.from.replace("{value}", withUnit);
  }

  if (quantity.qualifier === "upTo") {
    return templates.upTo.replace("{value}", withUnit);
  }

  return withUnit;
}
