import type { ComponentPropsWithoutRef } from "react";

type DescriptionSize = "default" | "compactMobile";
type DescriptionTone = "onDark" | "onLight";

type DescriptionProps = ComponentPropsWithoutRef<"p"> & {
  size?: DescriptionSize;
  tone?: DescriptionTone;
};

const sizeClasses: Record<DescriptionSize, string> = {
  default: "text-base sm:text-lg",
  compactMobile: "text-sm sm:text-lg",
};

const toneClasses: Record<DescriptionTone, string> = {
  onDark: "text-white/85",
  onLight: "text-ink/70",
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
