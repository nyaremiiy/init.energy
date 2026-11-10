import type { ComponentPropsWithoutRef, ElementType } from "react";

type EyebrowTone = "light" | "dark";
type EyebrowSize = "default" | "compact";

type EyebrowProps = {
  /** "light" — on light backgrounds (muted ink); "dark" — on dark (muted white). */
  tone?: EyebrowTone;
  size?: EyebrowSize;
  as?: ElementType;
} & ComponentPropsWithoutRef<"span">;

const toneClasses: Record<EyebrowTone, { text: string; dot: string }> = {
  light: { text: "text-ink/70", dot: "bg-current" },
  dark: { text: "text-white/75", dot: "bg-current" },
};

const sizeClasses: Record<EyebrowSize, string> = {
  default: "text-eyebrow-sm sm:text-eyebrow tracking-eyebrow",
  compact: "text-xs leading-4 tracking-wide",
};

/** Dotted uppercase label — one size and tracking across the whole site. */
export function Eyebrow({
  tone = "light",
  size = "default",
  as: Tag = "span",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 font-heading font-medium uppercase ${sizeClasses[size]} ${toneClasses[tone].text} ${className ?? ""}`}
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
