import type { ComponentPropsWithoutRef, ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "children" | "className"
> & {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
};

export function Heading({
  as: Tag = "h2",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={`font-semibold leading-tight tracking-tight ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
