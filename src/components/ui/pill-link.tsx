import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PillLinkTone = "light" | "tint" | "dark";

type PillLinkProps = {
  href: string;
  tone?: PillLinkTone;
  /** First link of a group: filled pill (white on dark, ink hover on light). */
  featured?: boolean;
  /** Right-hand value, e.g. a capacity or a price. */
  meta?: ReactNode;
  /** `compact`: an inline pill sized to its text (lists of regions); hover fills it with ink. */
  size?: "default" | "compact";
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const toneClasses: Record<PillLinkTone, { base: string; featured: string; meta: string }> = {
  light: {
    base: "border-line text-ink hover:border-ink",
    featured: "border-line bg-white text-ink hover:border-ink",
    meta: "text-muted",
  },
  tint: {
    base: "border-white bg-white text-ink hover:border-ink",
    featured: "border-white bg-white text-ink hover:border-ink",
    meta: "text-muted",
  },
  dark: {
    base: "border-line-dark text-white hover:border-white hover:bg-fill-dark",
    featured: "border-white bg-white text-ink hover:bg-surface",
    meta: "text-muted-dark",
  },
};

const focusClasses: Record<PillLinkTone, string> = {
  light: "focus-visible:outline-ink",
  tint: "focus-visible:outline-ink",
  dark: "focus-visible:outline-white",
};

/** Pill-shaped navigation link for rows of links (segment cards, FAQ topics). */
export function PillLink({ href, tone = "light", featured = false, meta, size = "default", children, className, ...props }: PillLinkProps) {
  const colours = toneClasses[tone];
  if (size === "compact") {
    return (
      <Link
        href={href}
        className={`group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-small font-medium text-ink transition-colors duration-200 ease-tech hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className ?? ""}`}
        {...props}
      >
        {children}
        <ArrowUpRight
          aria-hidden
          className="size-3.5 shrink-0 text-muted transition duration-200 group-hover:text-white motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
        />
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`group flex w-full min-w-0 items-center gap-3 rounded-full border px-4 py-3 text-small font-medium transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-5 ${focusClasses[tone]} ${featured ? colours.featured : colours.base} ${className ?? ""}`}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {meta ? (
        <span className={`shrink-0 text-right whitespace-nowrap tabular-nums ${featured ? "text-muted" : colours.meta}`}>
          {meta}
        </span>
      ) : null}
      <ArrowUpRight
        aria-hidden
        className="size-4.5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
