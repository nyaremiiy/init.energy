"use client";

import { AlertCircle, ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { inputClasses } from "@/components/ui/input-styles";

import { type FieldTone, useFieldContext } from "./field";

/**
 * Controls read id, aria wiring and error state from the surrounding Field.
 * Style comes only from inputClasses (single source). 56 px high, 16 px text.
 */
type ControlBase = {
  tone?: FieldTone;
  /** Marks the field invalid (border + icon); overrides the Field error. */
  invalid?: boolean;
};

function useControlProps(props: { id?: string; "aria-describedby"?: string } & ControlBase) {
  const field = useFieldContext();
  const invalid = props.invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
    "aria-invalid": invalid ? true : undefined,
    tone: props.tone ?? field?.tone ?? "light",
    invalid,
  };
}

/** Error icon inside the field (not for selects and unit fields). */
function ErrorIcon() {
  return <AlertCircle aria-hidden size={18} strokeWidth={1.7} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink" />;
}

export type TextInputProps = ControlBase & ComponentPropsWithoutRef<"input"> & { unit?: string };

/** Single-line text, email or phone. `type="tel"` gets inputMode and autoComplete set by the caller. */
export function TextInput({ tone: _t, invalid: _i, className, unit, ...props }: TextInputProps) {
  const c = useControlProps({ ...props, tone: _t, invalid: _i });
  const withIcon = c.invalid && !unit;
  return (
    <div className="relative flex min-w-0 items-center">
      <input
        {...props}
        id={c.id}
        aria-describedby={c["aria-describedby"]}
        aria-invalid={c["aria-invalid"]}
        className={inputClasses({ tone: c.tone, invalid: c.invalid, className: `${withIcon ? "pr-12" : ""} ${unit ? "pr-28" : ""} ${className ?? ""}` })}
      />
      {withIcon ? <ErrorIcon /> : null}
      {unit ? <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-small text-muted">{unit}</span> : null}
    </div>
  );
}

/** Number field with an optional unit suffix (muted, right). */
export function NumberInput(props: TextInputProps) {
  // Decimal keyboard by default (tariffs like 4,32); callers may pass "numeric".
  return <TextInput {...props} type="number" inputMode={props.inputMode ?? "decimal"} />;
}

export type TextareaProps = ControlBase & ComponentPropsWithoutRef<"textarea">;

/** Multi-line text: min 112 px, no resize. */
export function Textarea({ tone: _t, invalid: _i, className, ...props }: TextareaProps) {
  const c = useControlProps({ ...props, tone: _t, invalid: _i });
  return (
    <textarea
      {...props}
      id={c.id}
      aria-describedby={c["aria-describedby"]}
      aria-invalid={c["aria-invalid"]}
      className={inputClasses({ tone: c.tone, invalid: c.invalid, multiline: true, className })}
    />
  );
}

export type SelectProps = ControlBase & Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  options: Array<{ value: string; label: string }>;
  children?: ReactNode;
};

/** Native select with a chevron. Border and message carry the error (no icon). */
export function Select({ tone: _t, invalid: _i, className, options, ...props }: SelectProps) {
  const c = useControlProps({ ...props, tone: _t, invalid: _i });
  return (
    <div className="relative">
      <select
        {...props}
        id={c.id}
        aria-describedby={c["aria-describedby"]}
        aria-invalid={c["aria-invalid"]}
        className={inputClasses({ tone: c.tone, invalid: c.invalid, className: `appearance-none pr-12 ${className ?? ""}` })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden size={20} strokeWidth={1.7} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink" />
    </div>
  );
}
