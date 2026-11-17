"use client";

import { Check } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { FieldTone } from "./field";

type CheckboxProps = {
  tone?: FieldTone;
  invalid?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "children">;

/**
 * Native checkbox drawn as a 20 px box with a 6 px radius (rounded-md).
 * The label sits on the right and may hold an InlineLink.
 */
export function Checkbox({ tone = "light", invalid = false, children, className, ...props }: CheckboxProps) {
  const dark = tone === "dark";
  const box = dark
    ? "border-line-dark bg-fill-dark hover:border-white checked:border-white checked:bg-white"
    : "border-line bg-white hover:border-faint checked:border-ink checked:bg-ink";
  const mark = dark ? "text-ink" : "text-white";
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-small leading-relaxed has-disabled:cursor-not-allowed has-disabled:opacity-50 ${dark ? "text-muted-dark" : "text-muted"} ${className ?? ""}`}>
      <span className="relative mt-0.5 inline-flex size-5 shrink-0">
        <input
          type="checkbox"
          aria-invalid={invalid ? true : undefined}
          {...props}
          className={`peer size-5 cursor-pointer appearance-none rounded-md border transition-colors duration-200 ease-tech focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-line disabled:cursor-not-allowed disabled:bg-surface ${box} ${invalid ? (dark ? "border-white" : "border-ink") : ""}`}
        />
        <Check aria-hidden size={14} strokeWidth={3} className={`pointer-events-none absolute inset-0 m-auto opacity-0 transition-opacity duration-150 ease-tech peer-checked:opacity-100 ${mark}`} />
      </span>
      <span>{children}</span>
    </label>
  );
}
