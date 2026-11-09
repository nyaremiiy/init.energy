import type { SpecValue } from "@/content/product-pages";
import { formatQuantity, type Locale } from "@/lib/format";

/** Formats a spec value for the locale: quantities via the shared formatter. */
export function specValueText(value: SpecValue, locale: Locale): string {
  return "quantity" in value
    ? formatQuantity(value.quantity, locale)
    : value.text[locale];
}
