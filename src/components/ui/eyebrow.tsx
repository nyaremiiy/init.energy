import type { ComponentPropsWithoutRef, ElementType } from "react";

type EyebrowTone = "light" | "dark";

type EyebrowProps = {
  /** "light" — on light backgrounds (muted ink); "dark" — on dark (muted white). */
  tone?: EyebrowTone;
  as?: ElementType;
} & ComponentPropsWithoutRef<"span">;

const toneClasses: Record<EyebrowTone, { text: string; dot: string }> = {
  light: { text: "text-ink/70", dot: "bg-current" },
  dark: { text: "text-white/75", dot: "bg-current" },
};

/** Dotted uppercase label — one size and tracking across the whole site. */
export function Eyebrow({
  tone = "light",
  as: Tag = "span",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 font-heading text-eyebrow-sm font-medium sm:text-eyebrow tracking-eyebrow uppercase ${toneClasses[tone].text} ${className ?? ""}`}
      {...props}
    >
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${toneClasses[tone].dot}`}
      />
      {children}
    </Tag>
  );
}
