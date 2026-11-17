import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

type InlineLinkTone = "light" | "dark";

type InlineLinkProps = {
  href: string;
  tone?: InlineLinkTone;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const toneClasses: Record<InlineLinkTone, string> = {
  light: "text-ink decoration-faint hover:decoration-ink focus-visible:outline-ink",
  dark: "text-white decoration-faint-dark hover:decoration-white focus-visible:outline-white",
};

/** Link inside running text: underline, no arrow. External links open in a new tab. */
export function InlineLink({ href, tone = "light", className, children, ...props }: InlineLinkProps) {
  const external = /^https?:\/\//.test(href);
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const classes = `rounded-sm font-medium underline underline-offset-4 transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${toneClasses[tone]} ${className ?? ""}`;
  if (external) {
    return (
      <a href={href} className={classes} {...externalProps} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
