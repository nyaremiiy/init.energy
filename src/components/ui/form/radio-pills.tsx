"use client";

import { Check, type LucideIcon } from "lucide-react";

import { FieldGroup } from "./field";
import type { FieldTone } from "./field";
import { PillRadio } from "./pill-radio";

type RadioOption = { value: string; label: string; icon?: LucideIcon };

type RadioPillsProps = {
  legend: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  /** "pills": wrapping row of chips. "tiles": 84 px icon tiles in a 2 / 4 column grid (lead form object type). */
  variant?: "pills" | "tiles";
  tone?: FieldTone;
  hint?: string;
  error?: string;
};

/** A FieldGroup of native radios (arrow keys move the selection), as pills or icon tiles. */
export function RadioPills({ legend, name, options, value, onChange, variant = "pills", tone = "light", hint, error }: RadioPillsProps) {
  return (
    <FieldGroup legend={legend} tone={tone} hint={hint} error={error}>
      {variant === "tiles" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {options.map((o) => {
            const checked = value === o.value;
            const Icon = o.icon;
            return (
              <label key={o.value} className="cursor-pointer has-disabled:cursor-not-allowed">
                <input type="radio" className="peer sr-only" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} />
                <span
                  className={`relative flex h-21 flex-col justify-between rounded-tile border p-4 text-small font-medium transition-colors duration-200 ease-tech peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-disabled:opacity-50 ${
                    checked ? "border-ink bg-ink text-white" : "border-line bg-white text-ink peer-enabled:hover:border-faint"
                  }`}
                >
                  {Icon ? <Icon aria-hidden size={20} strokeWidth={1.7} /> : <span aria-hidden />}
                  {o.label}
                  {checked ? (
                    <span aria-hidden className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-white text-ink">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <PillRadio key={o.value} name={name} value={o.value} checked={value === o.value} tone={tone} onChange={() => onChange(o.value)}>
              {o.label}
            </PillRadio>
          ))}
        </div>
      )}
    </FieldGroup>
  );
}
