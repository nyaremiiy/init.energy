import type { ReactNode } from "react";

type TooltipProps = {
  /** Text shown on hover; also read by screen readers through aria-describedby. */
  text: string;
  id: string;
  children: ReactNode;
};

/**
 * Small hint above an element. Appears on hover of the wrapper (so it also works
 * on elements with pointer-events: none) and on keyboard focus within it.
 */
export function Tooltip({ text, id, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-64 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-card transition-opacity duration-150 ease-tech group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
