import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Inside a rounded Panel (hero, calculator, products, trust): the panel
   * already adds 8px from the screen edge, so the container adds 16px.
   * Elsewhere it adds 24px itself — content sits 24px from the edge on mobile
   * everywhere.
   */
  inPanel?: boolean;
};

export function Container({
  className,
  inPanel = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-360 ${inPanel ? "px-4" : "px-6"} sm:px-8 lg:px-10 ${className ?? ""}`}
      {...props}
    />
  );
}
