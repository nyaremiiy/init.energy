"use client";

import { usePathname } from "next/navigation";

import type { NavLink } from "./header-data";
import { SectionNavLink } from "./section-nav-link";

/** Section links of the current page (home or the solar plant page); nothing elsewhere. */
export function HeaderSectionLinks({ byPath }: { byPath: Record<string, NavLink[]> }) {
  const links = byPath[usePathname() ?? ""];
  if (!links || links.length === 0) return null;

  return (
    <>
      <ul className="flex h-full items-center gap-2 text-sm font-medium text-white/85">
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
      <span aria-hidden className="h-5 w-px bg-white/20" />
    </>
  );
}
