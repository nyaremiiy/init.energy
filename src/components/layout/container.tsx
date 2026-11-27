import type { ComponentPropsWithoutRef } from "react";

/**
 * The site's side gutter — the ONE place to change it (owner's decision
 * 2026-11-27: 8 px on phones, 16 px from 640 px). Container, Panel, the header
 * and the floating buttons all read it, so section content, the hero panel and
 * the fixed elements always share the same line from the screen edge.
 * Full class strings (not built at runtime), so Tailwind generates them.
 */
export const gutter = {
  /** Padding of a full-width wrapper. */
  padding: "px-panel-sm sm:px-panel",
  /** Left and right offset of a fixed / absolute element (the header over the hero). */
  inset: "inset-x-panel-sm sm:inset-x-panel",
  /** Right offset of a fixed element (floating buttons). */
  right: "right-panel-sm sm:right-panel",
} as const;

/** Inner padding of the content inside a rounded Panel (from the panel edge). */
const panelInner = "px-4 sm:px-8 lg:px-10";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Inside a rounded Panel (hero, calculator, products, trust): the content
   * keeps the panel's inner padding — 16 / 32 / 40 px from the panel edge.
   * Without it (white sections) the container sits exactly on the panel
   * edge: `gutter.padding`.
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
      className={`mx-auto w-full max-w-360 ${inPanel ? panelInner : gutter.padding} ${className ?? ""}`}
      {...props}
    />
  );
}
