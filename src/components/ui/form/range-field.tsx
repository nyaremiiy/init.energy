"use client";

import { type CSSProperties, useId } from "react";

import { useLocale } from "@/i18n/client";
import { formatNumber } from "@/lib/format";

/** Range slider (.range-input): label, value, min/max row, hint. Keyboard works natively. */
export type RangeFieldProps = {
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
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
      <p aria-hidden className="flex items-baseline gap-2 text-ink">
        <span className="font-heading text-number-sm font-medium tabular-nums">
          {formatNumber(value, locale)}
        </span>
        <span className="text-small text-muted">{unit}</span>
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
        className="flex justify-between text-small text-muted tabular-nums"
      >
        <span>{formatNumber(min, locale)}</span>
        <span>{maxLabel}</span>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
