"use client";

import { Check, type LucideIcon } from "lucide-react";

type CheckTileProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: LucideIcon;
  label: string;
  /** Second line, e.g. the appliance power «150 Вт». */
  meta?: string;
  /** "dark" on a dark panel: unchecked tiles are fill-dark, the checked one is white. */
  tone?: "light" | "dark";
};

/**
 * A native checkbox as a tile with an icon, a label and a value (appliances in
 * the outage picker). The check mark appears in the corner when it is on.
 */
export function CheckTile({ name, value, checked, onChange, icon: Icon, label, meta, tone = "light" }: CheckTileProps) {
  const off = tone === "dark" ? "border-line-dark bg-fill-dark text-white hover:border-muted-dark" : "border-line bg-white text-ink hover:border-faint";
  const on = tone === "dark" ? "border-white bg-white text-ink" : "border-ink bg-ink text-white";
  const focus = tone === "dark" ? "peer-focus-visible:outline-white" : "peer-focus-visible:outline-ink";

  return (
    <label className="cursor-pointer">
      <input type="checkbox" className="peer sr-only" name={name} value={value} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span
        className={`relative flex h-full min-h-24 flex-col justify-between gap-3 rounded-tile border p-3 transition-colors duration-200 ease-tech peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 sm:p-4 ${focus} ${checked ? on : off}`}
      >
        <Icon aria-hidden size={20} strokeWidth={1.7} />
        <span className="flex flex-col gap-0.5">
          <span className="min-w-0 text-small leading-snug font-medium wrap-anywhere">{label}</span>
          {meta ? <span className={`text-caption tabular-nums ${checked ? "text-muted" : tone === "dark" ? "text-muted-dark" : "text-muted"}`}>{meta}</span> : null}
        </span>
        {checked ? (
          <span
            aria-hidden
            className={`absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full motion-safe:animate-enter ${tone === "dark" ? "bg-ink text-white" : "bg-white text-ink"}`}
          >
            <Check size={12} strokeWidth={3} />
          </span>
        ) : null}
      </span>
    </label>
  );
}
