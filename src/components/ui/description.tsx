import type { ComponentPropsWithoutRef } from "react";

type DescriptionProps = ComponentPropsWithoutRef<"p">;

export function Description({ className, ...props }: DescriptionProps) {
  return (
    <p
      className={`text-base leading-relaxed text-white/85 sm:text-lg ${className ?? ""}`}
      {...props}
    />
  );
}
