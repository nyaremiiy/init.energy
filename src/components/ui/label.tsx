import type { ComponentPropsWithoutRef } from "react";

type LabelProps = ComponentPropsWithoutRef<"span">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <span
      className={`text-xs font-medium uppercase tracking-[0.12em] text-white/85 sm:text-sm ${className ?? ""}`}
      {...props}
    />
  );
}
