"use client";

import { FieldGroup } from "./field";
import type { FieldTone } from "./field";
import { PillRadio } from "@/components/ui/form/pill-radio";

type RadioPillsProps = {
  legend: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  tone?: FieldTone;
  hint?: string;
  error?: string;
};

/** A FieldGroup of native radios styled as pills. Arrow keys move the selection. */
export function RadioPills({ legend, name, options, value, onChange, tone = "light", hint, error }: RadioPillsProps) {
  return (
    <FieldGroup legend={legend} tone={tone} hint={hint} error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <PillRadio key={o.value} name={name} value={o.value} checked={value === o.value} tone={tone} onChange={() => onChange(o.value)}>
            {o.label}
          </PillRadio>
        ))}
      </div>
    </FieldGroup>
  );
}
