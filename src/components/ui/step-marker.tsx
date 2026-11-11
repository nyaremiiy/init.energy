import type { LucideIcon } from "lucide-react";

type StepMarkerTone = "light" | "dark";

const toneClasses: Record<StepMarkerTone, { index: string; icon: string }> = {
  light: { index: "text-ink/70", icon: "border-ink/15 text-ink" },
  dark: { index: "text-white/75", icon: "border-white/25 text-white" },
};

/**
 * Top row of a numbered step or argument card: «01» on the left, a lucide
 * icon in a round outline on the right. One look for every ordered list
 * (SES stages, hybrid plant nodes, trust arguments, BESS process).
 */
export function StepMarker({
  index,
  icon: Icon,
  tone = "light",
}: {
  index: number;
  icon: LucideIcon;
  tone?: StepMarkerTone;
}) {
  const classes = toneClasses[tone];

  return (
    <div className="flex items-center justify-between gap-4">
      <span
        aria-hidden
        className={`font-heading text-sm font-medium tabular-nums ${classes.index}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${classes.icon}`}
      >
        <Icon className="size-5" strokeWidth={1.7} />
      </span>
    </div>
  );
}
