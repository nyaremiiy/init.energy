import type { ComponentPropsWithoutRef } from "react";

type DescriptionSize = "default" | "compactMobile";

type DescriptionProps = ComponentPropsWithoutRef<"p"> & {
  size?: DescriptionSize;
};

const sizeClasses: Record<DescriptionSize, string> = {
  default: "text-base sm:text-lg",
  compactMobile: "text-sm sm:text-lg",
};

export function Description({
  className,
  size = "default",
  ...props
}: DescriptionProps) {
  return (
    <p
      className={`${sizeClasses[size]} leading-relaxed text-white/85 ${className ?? ""}`}
      {...props}
    />
  );
}
