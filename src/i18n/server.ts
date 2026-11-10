import { cache } from "react";

import { defaultLocale, type Locale } from "./config";
import { getMessagesFor } from "./messages";

/**
 * Locale of the current request for Server Components. Every layout and
 * page under a locale calls `setRequestLocale` first; components below read
 * it with `getLocale()` / `getMessages()` instead of prop drilling.
 */
const store = cache(() => ({ locale: defaultLocale as Locale }));

export function setRequestLocale(locale: Locale) {
  store().locale = locale;
}

export function getLocale(): Locale {
  return store().locale;
}

export function getMessages() {
  return getMessagesFor(getLocale());
}
