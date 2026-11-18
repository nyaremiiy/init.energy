import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type NavLinkTone = "light" | "dark";
type NavLinkSize = "caption" | "small" | "body";

const sizeClasses: Record<NavLinkSize, string> = {
  caption: "text-caption",
  small: "text-small",
  body: "text-body",
};

type NavLinkProps = {
  href: string;
  tone?: NavLinkTone;
  /** Current page: full colour and `aria-current="page"`. */
  active?: boolean;
  /** Text size; footer columns use body, the legal row caption. */
  size?: NavLinkSize;
} & Omit<ComponentPropsWithoutRef<"a">, "href">;

const toneClasses: Record<NavLinkTone, { idle: string; hover: string; active: string; focus: string }> = {
  light: { idle: "text-muted", hover: "hover:text-ink", active: "text-ink", focus: "focus-visible:outline-ink" },
  dark: { idle: "text-muted-dark", hover: "hover:text-white", active: "text-white", focus: "focus-visible:outline-white" },
};

/** Text navigation link (footer, breadcrumbs, header). Underline appears on hover. */
export function NavLink({ href, tone = "light", active = false, size = "small", className, children, ...props }: NavLinkProps) {
  const c = toneClasses[tone];
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-sm ${sizeClasses[size]} font-normal underline decoration-transparent underline-offset-6 transition-colors duration-150 ease-tech hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 ${c.focus} ${active ? c.active : `${c.idle} ${c.hover}`} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Link>
  );
}
