import { loadSetHours, type LoadSet } from "@/content/backup";
import type { ProductId } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/format";

/**
 * Product texts may name a runtime as `{hours.<load set>.<product>}`, e.g. `{hours.basic.svit600}`:
 * the hours come from the same calculation as the backup hub table (content/backup.ts),
 * so a product page never states a figure the calculators disagree with.
 */
export function fillHours(text: string, locale: Locale): string {
  return text.replace(/\{hours\.(\w+)\.(\w+)\}/g, (match, set: string, id: string) => {
    const hours = loadSetHours(set as LoadSet["id"], id as ProductId);
    return hours === null ? match : formatNumber(hours, locale);
  });
}
