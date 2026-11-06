import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type PanelVariant = "dark" | "light";

type PanelProps = {
  variant?: PanelVariant;
  /** Element for the outer wrapper (e.g. "section", "footer"). */
  as?: ElementType;
  /** Classes for the inner rounded panel. */
  panelClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const variantClasses: Record<PanelVariant, string> = {
  dark: "bg-ink text-white",
  light: "bg-surface text-ink",
};

/**
 * Large section panel (hero, trust block, footer): the same gap from the
 * screen edges (8px mobile / 16px sm+) and the same radius on every side
 * (24px / 32px), overflow hidden.
 */
export function Panel({
  variant = "dark",
  as: Tag = "div",
  className,
  panelClassName,
  children,
  ...props
}: PanelProps) {
  return (
    <Tag className={`px-panel-sm sm:px-panel ${className ?? ""}`} {...props}>
      <div
        className={`relative overflow-hidden rounded-panel-sm sm:rounded-panel ${variantClasses[variant]} ${panelClassName ?? ""}`}
      >
        {children}
      </div>
    </Tag>
  );
}
