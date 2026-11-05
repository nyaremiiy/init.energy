import type { ComponentPropsWithoutRef } from "react";

type LabelProps = ComponentPropsWithoutRef<"span">;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-white/85 sm:text-sm ${className ?? ""}`}
      {...props}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-white" />
      {children}
    </span>
  );
}
