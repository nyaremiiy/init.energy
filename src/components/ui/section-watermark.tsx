type SectionWatermarkProps = {
  text: string;
  /** Edge the vertical word is pressed against. */
  side?: "left" | "right";
  /** "light" on white/light sections, "dark" on dark panels. */
  tone?: "light" | "dark";
  /** Vertical centre: "center" of the section, or "upper" quarter (sections with a photo at the bottom). */
  align?: "center" | "upper";
};

/**
 * Oversized vertical word behind a section's content, flush with one edge.
 * Decorative only: hidden from assistive tech, no pointer events. The parent
 * must be `relative overflow-hidden`, and the content above it `relative`.
 */
export function SectionWatermark({
  text,
  side = "left",
  tone = "light",
  align = "center",
}: SectionWatermarkProps) {
  // Reads bottom-to-top on the left edge, top-to-bottom on the right edge.
  const position = side === "left" ? "left-20" : "right-20";
  const rotation = side === "left" ? "-rotate-90" : "rotate-90";
  const color = tone === "dark" ? "text-white/5" : "text-ink/5";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute hidden size-0 md:block ${align === "upper" ? "top-1/4" : "top-1/2"} ${position}`}
    >
      <span
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${rotation} font-heading text-display font-semibold tracking-tight whitespace-nowrap uppercase ${color}`}
      >
        {text}
      </span>
    </div>
  );
}
