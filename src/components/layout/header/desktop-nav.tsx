import { ChevronDown } from "lucide-react";

import { isNavGroup, navItems } from "./header-data";
import { MegaMenuPanel } from "./mega-menu-panel";
import { NavLink } from "./nav-link";
import { SectionNavLink } from "./section-nav-link";

export function DesktopNav() {
  return (
    <nav aria-label="Головне меню" className="hidden self-stretch lg:block">
      <ul className="flex h-full items-center gap-8 text-sm font-medium text-white/85">
        {navItems.map((item) =>
          isNavGroup(item) ? (
            <li
              key={item.label}
              data-mega-menu
              className="group flex h-full items-center"
            >
              <button
                type="button"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 transition-colors group-focus-within:text-white group-hover:text-white"
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                />
              </button>
              <MegaMenuPanel group={item} />
            </li>
          ) : (
            <li key={item.href}>
              {item.sectionId ? (
                <SectionNavLink
                  href={item.href}
                  label={item.label}
                  sectionId={item.sectionId}
                />
              ) : (
                <NavLink
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
