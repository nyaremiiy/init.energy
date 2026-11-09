import type { ComponentPropsWithoutRef, ReactNode } from "react";

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
      <span className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-5 text-sm font-medium text-ink transition-colors duration-180 ease-tech peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-ink/15 peer-disabled:opacity-50 peer-enabled:hover:border-ink/40">
        {children}
      </span>
    </label>
  );
}
