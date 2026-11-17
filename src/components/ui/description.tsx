import type { ComponentPropsWithoutRef } from "react";

type DescriptionSize = "default" | "compactMobile";
type DescriptionTone = "onDark" | "onLight";

type DescriptionProps = ComponentPropsWithoutRef<"p"> & {
  size?: DescriptionSize;
  tone?: DescriptionTone;
};

const sizeClasses: Record<DescriptionSize, string> = {
  default: "text-body sm:text-lead",
  compactMobile: "text-small sm:text-lead",
};

const toneClasses: Record<DescriptionTone, string> = {
  onDark: "text-muted-dark",
  onLight: "text-muted",
};

export function Description({
  className,
  size = "default",
  tone = "onDark",
  ...props
}: DescriptionProps) {
  return (
    <p
      className={`${sizeClasses[size]} leading-relaxed ${toneClasses[tone]} ${className ?? ""}`}
      {...props}
    />
  );
}
