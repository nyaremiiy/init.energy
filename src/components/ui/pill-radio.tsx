import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { chipBase } from "./chip-styles";

type PillRadioProps = {
  children: ReactNode;
  /** "light" on light cards, "dark" on dark panels. */
  tone?: "light" | "dark";
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "children" | "className">;

/**
 * Native radio styled as a pill (lead form, calculator). Native radios keep
 * arrow-key navigation inside the group; wrap a set in <fieldset>/<legend>.
 */
const toneClasses = {
  light:
    "border-line bg-white text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-ink/15 peer-enabled:hover:border-ink/40",
  dark: "border-white/20 text-white peer-checked:border-white peer-checked:bg-white peer-checked:text-ink peer-focus-visible:ring-white/25 peer-enabled:hover:border-white",
};

export function PillRadio({
  children,
  tone = "light",
  ...inputProps
}: PillRadioProps) {
  return (
    <label className="cursor-pointer has-disabled:cursor-not-allowed">
      <input type="radio" className="peer sr-only" {...inputProps} />
      <span
        className={`${chipBase} ${toneClasses[tone]} peer-focus-visible:ring-3 peer-disabled:opacity-50 focus-visible:outline-none`}
      >
        {children}
      </span>
    </label>
  );
}
