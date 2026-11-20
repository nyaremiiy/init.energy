/**
 * Calculator data for the lead (hidden `calculatorData` → CRM). Pure, no
 * imports: tested in calculator-lead.test.mjs.
 *
 * Only fields the visitor actually touched go to `selected`; the rest of the
 * inputs the recommendation was worked out with go to `assumed`, so a manager
 * can tell a choice from a default. Fields that do not apply to the chosen
 * goal (region for backup only, hours for savings only) are left out.
 */

export type CalculatorKind = "quick" | "ses-payback";

export type CalculatorValue = string | number | string[];

export type CalculatorLeadData = {
  calculator: CalculatorKind;
  changedFields: string[];
  selected: Record<string, CalculatorValue>;
  assumed: Record<string, CalculatorValue>;
  /** Fields chosen from outside the form, e.g. `{ objectType: "url" }` (?type= from a niche page). */
  sources?: Record<string, "url">;
  recommendation: unknown;
  /** Set by the lead form when the visitor picked another object type there. */
  objectTypeOverridden?: true;
};

export type CalculatorLeadInput = {
  calculator: CalculatorKind;
  /** Every input in display order; `undefined` = not set (optional field left empty). */
  values: [field: string, value: CalculatorValue | undefined][];
  /** Fields that apply to the current goal. */
  applicable: (field: string) => boolean;
  changed: ReadonlySet<string>;
  sources?: Record<string, "url">;
  recommendation: unknown;
};

/** `null` when the visitor changed nothing: nothing is attached to the lead. */
export function buildCalculatorLeadData(input: CalculatorLeadInput): CalculatorLeadData | null {
  const selected: Record<string, CalculatorValue> = {};
  const assumed: Record<string, CalculatorValue> = {};
  const changedFields: string[] = [];

  for (const [field, value] of input.values) {
    if (!input.applicable(field)) continue;
    if (input.changed.has(field)) {
      changedFields.push(field);
      if (value !== undefined) selected[field] = value;
    } else if (value !== undefined) {
      assumed[field] = value;
    }
  }

  if (changedFields.length === 0) return null;

  const sources = Object.fromEntries(
    Object.entries(input.sources ?? {}).filter(([field]) => changedFields.includes(field)),
  );

  return {
    calculator: input.calculator,
    changedFields,
    selected,
    assumed,
    ...(Object.keys(sources).length > 0 ? { sources } : {}),
    recommendation: input.recommendation,
  };
}
