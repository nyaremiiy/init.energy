"use client";

import { Check } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { chipClasses } from "@/components/ui/chip-styles";

type CheckChipProps = {
  checked: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "children" | "className">;

/** Multi-select chip: a native checkbox (sr-only) styled with chipClasses. Use for choosing, not navigation. */
export function CheckChip({ checked, children, ...inputProps }: CheckChipProps) {
  return (
    <label className="cursor-pointer has-disabled:cursor-not-allowed has-disabled:opacity-50">
      <input type="checkbox" className="peer sr-only" checked={checked} {...inputProps} />
      <span className={`gap-2 peer-focus-visible:ring-3 peer-focus-visible:ring-line ${chipClasses({ selected: checked })}`}>
        {checked ? <Check aria-hidden className="size-4" /> : null}
        {children}
      </span>
    </label>
  );
}
