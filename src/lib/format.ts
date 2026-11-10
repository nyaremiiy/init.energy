import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";

export type { Locale };

const intlLocales: Record<Locale, string> = {
  uk: "uk-UA",
  en: "en-US",
};

export type Unit = "W" | "kW" | "Wh" | "kWh" | "cycles" | "V";

export type Quantity = {
  value: number;
  unit: Unit;
  /** "from" → «від 208 кВт·год», "upTo" → «до 1044 кВт·год», "plus" → «6000+ циклів». */
  qualifier?: "from" | "upTo" | "plus";
};

/** Locale is required: UA uses a decimal comma, EN a decimal point. */
export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocales[locale], {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!/^380\d{9}$/.test(digits)) {
    return value;
  }

  return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
}

export function formatQuantity(quantity: Quantity, locale: Locale) {
  const { units, quantity: templates } = getMessagesFor(locale);
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
