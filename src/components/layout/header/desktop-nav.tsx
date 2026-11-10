import { getLocale, getMessages } from "@/i18n/server";

import {
  getNavItems,
  isNavGroup,
  type NavGroup,
  type NavLink as PageLink,
} from "./header-data";
import { HomeOnly } from "./home-only";
import { MegaMenuItem } from "./mega-menu-item";
import { NavLink } from "./nav-link";
import { SectionNavLink } from "./section-nav-link";

/**
 * Desktop header menu in two clusters, split by a thin divider:
 * left — catalogue groups with mega menus;
 * right — links to sections of the current page.
 */
export function DesktopNav() {
  const navItems = getNavItems(getLocale());
  const groups = navItems.filter((item): item is NavGroup => isNavGroup(item));
  const pageLinks = navItems.filter(
    (item): item is PageLink => !isNavGroup(item),
  );

  return (
    <nav
      aria-label={getMessages().chrome.header.mainMenu}
      className="hidden self-stretch lg:flex lg:items-center lg:gap-6"
    >
      <HomeOnly>
        <ul className="flex h-full items-center gap-2 text-sm font-medium text-white/85">
          {pageLinks.map((item) => (
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
                  className="inline-flex items-center px-3 py-1.5 transition-colors hover:text-white"
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <span aria-hidden className="h-5 w-px bg-white/20" />
      </HomeOnly>

      <ul className="flex h-full items-center gap-8 text-sm font-medium text-white/85">
        {groups.map((item) => (
          <MegaMenuItem key={item.label} group={item} />
        ))}
      </ul>
    </nav>
  );
}
