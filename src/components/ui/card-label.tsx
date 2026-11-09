import type { ComponentPropsWithoutRef } from "react";

type CardLabelTone = "light" | "dark";

type CardLabelProps = {
  /** "light" — dark outline on light cards; "dark" — light outline on dark cards or photos. */
  tone?: CardLabelTone;
  /** Turn the label light when the parent card is hovered (cards that go dark on hover). */
  hoverInverse?: boolean;
} & ComponentPropsWithoutRef<"span">;

const toneClasses: Record<CardLabelTone, string> = {
  light: "border-ink/20 text-ink/70",
  dark: "border-white/25 text-white/75",
};

/** Pill label for cards: same look as the filter chips on the site. */
export function CardLabel({
  tone = "light",
  hoverInverse = false,
  className,
  children,
  ...props
}: CardLabelProps) {
  const hover = hoverInverse
    ? "group-hover:border-white/25 group-hover:text-white/75"
    : "";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-heading text-eyebrow font-medium tracking-eyebrow whitespace-nowrap uppercase transition-colors duration-200 ease-tech ${toneClasses[tone]} ${hover} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
