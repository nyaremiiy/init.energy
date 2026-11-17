"use client";

import type { FieldTone } from "./field";

type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tone?: FieldTone;
  /** id of the element that names the switch. */
  labelledBy?: string;
  describedBy?: string;
};

/** On/off switch (button role="switch"), 48×28. Extracted from the cookie banner. */
export function Switch({ checked, onChange, disabled, tone = "light", labelledBy, describedBy }: SwitchProps) {
  const dark = tone === "dark";
  const track = checked ? (dark ? "bg-white" : "bg-ink") : "bg-line";
  const knob = checked && dark ? "bg-ink" : "bg-white";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-tech focus-visible:outline-none focus-visible:ring-3 ${dark ? "focus-visible:ring-line-dark" : "focus-visible:ring-line"} disabled:cursor-not-allowed disabled:opacity-60 ${track}`}
    >
      <span aria-hidden className={`size-5.5 rounded-full transition-transform duration-200 ease-tech ${knob} ${checked ? "translate-x-5.75" : "translate-x-0.75"}`} />
    </button>
  );
}
