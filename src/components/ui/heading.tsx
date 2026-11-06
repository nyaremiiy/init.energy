import type { ComponentPropsWithoutRef, ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingLineHeight = "default" | "compact";
type HeadingLetterSpacing = "tight" | "normal" | "wide";

type HeadingProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "children" | "className"
> & {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  letterSpacing?: HeadingLetterSpacing;
  lineHeight?: HeadingLineHeight;
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
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={`font-semibold ${letterSpacingClasses[letterSpacing]} ${lineHeightClasses[lineHeight]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
