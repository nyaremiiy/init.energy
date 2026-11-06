import uk from "../../messages/uk.json";

// Temporary loader until next-intl is introduced.
export const messages = uk;

export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
