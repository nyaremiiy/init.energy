import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { chipBase } from "./chip-styles";

type PillRadioProps = {
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "children" | "className">;

/**
 * Native radio styled as a pill (lead form, calculator). Native radios keep
 * arrow-key navigation inside the group; wrap a set in <fieldset>/<legend>.
 */
export function PillRadio({ children, ...inputProps }: PillRadioProps) {
  return (
    <label className="cursor-pointer has-disabled:cursor-not-allowed">
      <input type="radio" className="peer sr-only" {...inputProps} />
      <span
        className={`${chipBase} border-line bg-white text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-ink/15 peer-disabled:opacity-50 peer-enabled:hover:border-ink/40 focus-visible:outline-none`}
      >
        {children}
      </span>
    </label>
  );
}
