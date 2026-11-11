"use client";

import { ChevronDown } from "lucide-react";
import { type CSSProperties, type ReactNode, useId } from "react";

import { inputClasses } from "@/components/ui/input-styles";
import { useLocale } from "@/i18n/client";
import { formatNumber } from "@/lib/format";

/**
 * Form fields shared by every calculator on the site (home quick calculator,
 * SES payback calculator): one look for sliders, pill groups, selects and
 * number inputs.
 */

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Right end label, e.g. «1 200+». */
  maxLabel: string;
  hint?: string;
  name?: string;
  onChange: (value: number) => void;
};

/** Native range input: arrow keys, Home/End and PageUp/PageDown work out of the box. */
export function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit,
  maxLabel,
  hint,
  name,
  onChange,
}: RangeFieldProps) {
  const locale = useLocale();
  const id = useId();
  const clamped = Math.min(Math.max(value, min), max);
  const fill = ((clamped - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <p aria-hidden className="flex items-baseline gap-2 text-ink">
        <span className="font-heading text-number-sm font-medium tabular-nums">
          {formatNumber(value, locale)}
        </span>
        <span className="text-sm text-ink/70">{unit}</span>
      </p>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        aria-valuetext={`${formatNumber(value, locale)} ${unit}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-input"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      <div
        aria-hidden
        className="flex justify-between text-sm text-ink/70 tabular-nums"
      >
        <span>{formatNumber(min, locale)}</span>
        <span>{maxLabel}</span>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Fieldset with a visible legend and a wrapping row of pills (PillRadio or chips). */
export function Group({
  legend,
  children,
  hint,
}: {
  legend: string;
  children: ReactNode;
  hint?: string;
}) {
  const hintId = useId();

  return (
    <fieldset
      className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
      aria-describedby={hint ? hintId : undefined}
    >
      <legend className="mb-3 text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {hint ? (
        <p id={hintId} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Native select in the site input style with a chevron. */
export function SelectField({
  label,
  value,
  options,
  hint,
  name,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  hint?: string;
  name?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClasses({})} cursor-pointer appearance-none pr-12`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink/70"
        />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Optional number input: an empty field means «not set» (0). A unit sits inside on the right. */
export function NumberField({
  label,
  value,
  min,
  step,
  hint,
  unit,
  placeholder = "—",
  name,
  required,
  onChange,
}: {
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
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          required={required}
          value={value || ""}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className={inputClasses({ className: unit ? "pr-28" : undefined })}
        />
        {unit ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-ink/70"
          >
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
