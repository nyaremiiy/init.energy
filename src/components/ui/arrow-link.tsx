import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ArrowLinkTone = "light" | "dark";

type ArrowLinkProps = {
  href: string;
  tone?: ArrowLinkTone;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const toneClasses: Record<ArrowLinkTone, string> = {
  light:
    "text-ink decoration-ink/30 hover:decoration-ink focus-visible:outline-ink",
  dark: "text-white decoration-white/40 hover:decoration-white focus-visible:outline-white",
};

/** Underlined text link with a 16px ArrowUpRight («Розрахувати систему», «Детальніше» …). */
export function ArrowLink({
  href,
  tone = "light",
  className,
  children,
  ...props
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-semibold whitespace-nowrap underline underline-offset-4 transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-4 ${toneClasses[tone]} ${className ?? ""}`}
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
