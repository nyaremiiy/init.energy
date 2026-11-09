import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type CardLabelTone = "light" | "dark";

type CardLabelProps = {
  /** "light" — dark outline on light cards; "dark" — light outline on dark cards or photos. */
  tone?: CardLabelTone;
  /** Turn the label light when the parent card is hovered (cards that go dark on hover). */
  hoverInverse?: boolean;
  /** Segment icon shown before the text. */
  icon?: LucideIcon;
} & ComponentPropsWithoutRef<"span">;

const toneClasses: Record<CardLabelTone, string> = {
  light: "border-ink/15 text-ink/60",
  dark: "border-white/20 text-white/70",
};

/** Pill label for cards: same look as the filter chips on the site. */
export function CardLabel({
  tone = "light",
  hoverInverse = false,
  icon: Icon,
  className,
  children,
  ...props
}: CardLabelProps) {
  const hover = hoverInverse
    ? "group-hover:border-white/20 group-hover:text-white/70"
    : "";

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-tech ${toneClasses[tone]} ${hover} ${className ?? ""}`}
      {...props}
    >
      {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
      {children}
    </span>
  );
}
