import type { ComponentPropsWithoutRef } from "react";

type CardLabelTone = "light" | "dark";

type CardLabelProps = {
  /** "light" — dark outline on light cards; "dark" — light outline on dark cards or photos. */
  tone?: CardLabelTone;
  /** Turn the label light when the parent card is hovered (cards that go dark on hover). */
  hoverInverse?: boolean;
} & ComponentPropsWithoutRef<"span">;

const toneClasses: Record<CardLabelTone, string> = {
  light: "border-ink/20 text-ink",
  dark: "border-white/25 text-white",
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
    ? "group-hover:border-white/25 group-hover:text-white"
    : "";

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center self-start rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-tech ${toneClasses[tone]} ${hover} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
