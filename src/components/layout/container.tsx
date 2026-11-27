import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Inside a rounded Panel (hero, calculator, products, trust): the content
   * keeps the panel's inner padding — 16 / 32 / 40 px from the panel edge.
   * Without it (white sections, owner's decision 2026-11-27) the container
   * sits exactly on the panel edge: 8 px from the screen, 16 px from 640 px
   * (the same tokens as Panel).
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
      className={`mx-auto w-full max-w-360 ${inPanel ? "px-4 sm:px-8 lg:px-10" : "px-panel-sm sm:px-panel"} ${className ?? ""}`}
      {...props}
    />
  );
}
