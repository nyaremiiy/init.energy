import { ArrowUpRight } from "lucide-react";

import type { NavMenuLink } from "./header-data";
import { NavLink } from "./nav-link";

/**
 * One item of the light menus (desktop panel and mobile menu): name, a short
 * caption and a muted arrow on the right (or the product capacity before it).
 * Hover / keyboard focus: `surface` background, ink arrow shifted by 2 px.
 */
export function MenuLink({ link, onNavigate }: { link: NavMenuLink; onNavigate?: () => void }) {
  return (
    <NavLink
      href={link.href}
      onClick={onNavigate}
      className="group/link flex min-h-11 items-start gap-3 rounded-tile px-3 py-2.5 transition-colors duration-150 ease-tech hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:bg-surface"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body leading-snug font-semibold text-ink">{link.label}</span>
        <span className="text-caption text-muted">{link.description}</span>
      </span>
      {link.meta ? <span className="pt-0.5 text-small whitespace-nowrap text-muted tabular-nums">{link.meta}</span> : null}
      <ArrowUpRight
        aria-hidden
        className="mt-1 size-4 shrink-0 text-faint transition duration-150 ease-tech group-hover/link:text-ink group-focus-visible/link:text-ink motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5"
      />
    </NavLink>
  );
}
