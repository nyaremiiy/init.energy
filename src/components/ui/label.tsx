import type { ComponentPropsWithoutRef } from "react";

type LabelTone = "onDark" | "onLight";

type LabelProps = ComponentPropsWithoutRef<"span"> & {
  tone?: LabelTone;
};

const toneClasses: Record<LabelTone, { text: string; dot: string }> = {
  onDark: { text: "text-white/85", dot: "bg-white" },
  onLight: { text: "text-ink/70", dot: "bg-ink" },
};

export function Label({
  className,
  children,
  tone = "onDark",
  ...props
}: LabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] sm:text-sm ${toneClasses[tone].text} ${className ?? ""}`}
      {...props}
    >
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${toneClasses[tone].dot}`}
      />
      {children}
    </span>
  );
}
