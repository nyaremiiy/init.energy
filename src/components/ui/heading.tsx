import type { ComponentPropsWithoutRef, ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingLineHeight = "default" | "compact";
type HeadingLetterSpacing = "tight" | "normal" | "wide";
type HeadingWeight = "medium" | "semibold";
/** Type-scale presets: every section H2 and every card H3 uses one of these. */
type HeadingSize = "h2" | "h3";

const sizeClasses: Record<HeadingSize, string> = {
  h2: "text-h2-sm sm:text-h2-md lg:text-h2",
  h3: "text-h3-sm sm:text-h3",
};

const weightClasses: Record<HeadingWeight, string> = {
  medium: "font-medium",
  semibold: "font-semibold",
};

type HeadingProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "children" | "className"
> & {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  letterSpacing?: HeadingLetterSpacing;
  lineHeight?: HeadingLineHeight;
  weight?: HeadingWeight;
  /** Scale preset; its line-height replaces `lineHeight`. */
  size?: HeadingSize;
};

const lineHeightClasses: Record<HeadingLineHeight, string> = {
  default: "leading-tight",
  compact: "leading-none",
};

const letterSpacingClasses: Record<HeadingLetterSpacing, string> = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
};

export function Heading({
  as: Tag = "h2",
  className,
  children,
  letterSpacing = "tight",
  lineHeight = "default",
  weight,
  size,
  ...props
}: HeadingProps) {
  // H3 cards use medium (500); other headings default to semibold.
  const fontWeight = weight ?? (size === "h3" ? "medium" : "semibold");
  return (
    <Tag
      className={`font-heading ${weightClasses[fontWeight]} ${letterSpacingClasses[letterSpacing]} ${size ? sizeClasses[size] : lineHeightClasses[lineHeight]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
