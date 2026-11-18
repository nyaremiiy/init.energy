"use client";

import { FieldGroup, Field } from "@/components/ui/form/field";
import { Select, NumberInput } from "@/components/ui/form/controls";

export { RangeField } from "@/components/ui/form/range-field";

/** Pill group for the calculators (wraps the shared FieldGroup). */
export function Group({ legend, children, hint }: { legend: string; children: React.ReactNode; hint?: string }) {
  return (
    <FieldGroup legend={legend} hint={hint}>
      <div className="flex flex-wrap gap-2">{children}</div>
    </FieldGroup>
  );
}

/** Select in the shared field style (Field + Select). */
export function SelectField({ label, value, options, hint, name, onChange }: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  hint?: string;
  name?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <Select name={name} value={value} options={options} onChange={(event) => onChange(event.target.value)} className="cursor-pointer" />
    </Field>
  );
}

/** Optional number: an empty field means «not set» (0). Unit sits inside on the right. */
export function NumberField({ label, value, min, step, hint, unit, placeholder = "—", name, required, onChange }: {
  label: string;
  value: number;
  min: number;
  step: number;
  hint?: string;
  unit?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <NumberInput
        name={name}
        min={min}
        step={step}
        required={required}
        unit={unit}
        inputMode="decimal"
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    </Field>
  );
}
