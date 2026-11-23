/**
 * Short spoken summary of a calculator result for one sr-only status
 * region: «СЕС 5 кВт, накопичувач SVIT HOME, резерв близько 15 год.».
 * Parts without a value are skipped; the first letter is capitalised
 * (the sentence may start with «накопичувач» when there is no plant).
 */
export function buildCalculatorSummary(parts: (string | undefined | null | false)[]): string {
  const text = parts.filter((part): part is string => typeof part === "string" && part.length > 0).join(", ");
  if (!text) return "";
  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}.`;
}
