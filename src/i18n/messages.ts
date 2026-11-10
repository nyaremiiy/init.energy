import enJson from "../../messages/en.json";
import ukJson from "../../messages/uk.json";

import type { Locale } from "./config";

export type Messages = typeof ukJson;

// Typed as Messages: a key missing in en.json fails the build.
const en: Messages = enJson;

const dictionaries: Record<Locale, Messages> = { uk: ukJson, en };

export function getMessagesFor(locale: Locale): Messages {
  return dictionaries[locale];
}

/** Fills «{name}» placeholders in a template. */
export function format(template: string, values: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match,
  );
}
