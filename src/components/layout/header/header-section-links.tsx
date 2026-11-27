"use client";

import { usePathname } from "next/navigation";

import type { NavLink } from "./header-data";
import { SectionNavLink } from "./section-nav-link";

/**
 * Section links of the current page (home, solar hub, niche pages); nothing
 * elsewhere. Shown only from `wide` (1440 px): below that they do not fit next to the
 * catalogue menus and the CTA (phones and tablets get them in the burger menu).
 */
export function HeaderSectionLinks({ byPath }: { byPath: Record<string, NavLink[]> }) {
  const links = byPath[usePathname() ?? ""];
  if (!links || links.length === 0) return null;

  return (
    <>
      <ul className="hidden h-full items-center gap-1 text-small font-medium whitespace-nowrap text-muted-dark wide:flex">
        {links.map((item) => (
          <li key={item.href}>
            <SectionNavLink
              href={item.href}
              label={item.label}
              sectionId={item.sectionId ?? ""}
            />
          </li>
        ))}
      </ul>
      <span aria-hidden className="hidden h-5 w-px shrink-0 bg-line-dark wide:block" />
    </>
  );
}
