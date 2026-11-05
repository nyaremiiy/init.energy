import type { ComponentPropsWithoutRef, ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingLineHeight = "default" | "compact";

type HeadingProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "children" | "className"
> & {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  lineHeight?: HeadingLineHeight;
};

const lineHeightClasses: Record<HeadingLineHeight, string> = {
  default: "leading-tight",
  compact: "leading-none",
};

export function Heading({
  as: Tag = "h2",
  className,
  children,
  lineHeight = "default",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={`font-semibold tracking-tight ${lineHeightClasses[lineHeight]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
