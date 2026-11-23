import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ArrowLinkTone = "light" | "dark";

type ArrowLinkProps = {
  href: string;
  tone?: ArrowLinkTone;
  /** Lets long, data-driven text wrap (e.g. region names) instead of widening the page. */
  wrap?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const toneClasses: Record<ArrowLinkTone, string> = {
  light:
    "text-ink decoration-faint hover:decoration-ink focus-visible:outline-ink",
  dark: "text-white decoration-faint-dark hover:decoration-white focus-visible:outline-white",
};

/** Underlined text link with a 16px ArrowUpRight («Розрахувати систему», «Детальніше» …). */
export function ArrowLink({
  href,
  tone = "light",
  wrap = false,
  className,
  children,
  ...props
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-semibold ${wrap ? "" : "whitespace-nowrap"} underline underline-offset-4 transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-4 ${toneClasses[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 shrink-0 transition-transform duration-150 ease-tech motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
