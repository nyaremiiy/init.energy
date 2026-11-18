import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type RowLinkTone = "light" | "dark";

type RowLinkProps = {
  href: string;
  title: string;
  description?: string;
  /** Shown from sm up only (mobile hides the value, as on the product pages). */
  meta?: ReactNode;
  tone?: RowLinkTone;
  external?: boolean;
  /** Top hairline between list rows (default); off for a single row inside a card. */
  bordered?: boolean;
};

const toneClasses: Record<RowLinkTone, { border: string; title: string; muted: string; icon: string; focus: string }> = {
  light: {
    border: "border-line",
    title: "text-ink",
    muted: "text-muted",
    icon: "border-line text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-white",
    focus: "focus-visible:outline-ink",
  },
  dark: {
    border: "border-line-dark",
    title: "text-white",
    muted: "text-muted-dark",
    icon: "border-faint-dark text-white group-hover:border-white group-hover:bg-line-dark",
    focus: "focus-visible:outline-white",
  },
};

/** Full-width list row: title, optional description and value, decorative arrow circle. */
export function RowLink({ href, title, description, meta, tone = "light", external = false, bordered = true }: RowLinkProps) {
  const c = toneClasses[tone];
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 py-5 transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${bordered ? `border-t ${c.border}` : ""} ${c.focus}`}
      {...externalProps}
    >
      <span className="min-w-0 flex-1">
        <span className={`block font-heading text-h3-sm font-semibold ${c.title}`}>{title}</span>
        {description ? <span className={`mt-1 block text-small ${c.muted}`}>{description}</span> : null}
      </span>
      {meta ? <span className={`hidden text-body font-medium whitespace-nowrap tabular-nums sm:inline ${c.title}`}>{meta}</span> : null}
      <span aria-hidden className={`flex size-11 items-center justify-center rounded-full border transition-colors duration-150 ease-tech ${c.icon}`}>
        <ArrowUpRight className="size-4.5 transition-transform duration-150 ease-tech motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
