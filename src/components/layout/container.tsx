import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Inside a rounded Panel (hero, calculator, products, trust): the panel
   * already adds 8px from the screen edge, so the container adds 10px.
   * Elsewhere it adds 18px itself — content sits 18px from the edge on mobile
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
      className={`mx-auto w-full max-w-360 ${inPanel ? "px-2.5" : "px-4.5"} sm:px-8 lg:px-10 ${className ?? ""}`}
      {...props}
    />
  );
}
