import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
};

/** Underlined secondary link with an arrow, used in section headers. */
export function TextLink({ href, children }: TextLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
