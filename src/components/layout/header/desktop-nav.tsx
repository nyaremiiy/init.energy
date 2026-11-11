import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";

import {
  getNavItems,
  isNavGroup,
  pageSectionLinks,
  type NavGroup,
  type NavLink as PageLink,
} from "./header-data";
import { HeaderSectionLinks } from "./header-section-links";
import { MegaMenuItem } from "./mega-menu-item";

/**
 * Desktop header menu in two clusters, split by a thin divider:
 * left — the section links of the current page (home, the solar plant page, niche pages);
 * right — catalogue groups with mega menus.
 */
export function DesktopNav() {
  const locale = getLocale();
  const navItems = getNavItems(locale);
  const groups = navItems.filter((item): item is NavGroup => isNavGroup(item));
  const sectionsByPath = {
    [localizePath(routes.home, locale)]: navItems.filter(
      (item): item is PageLink => !isNavGroup(item),
    ),
    ...Object.fromEntries(
      [routes.services.turnkeySes, routes.solutions.hotel].map((path) => {
        const localized = localizePath(path, locale);
        return [localized, pageSectionLinks(localized, locale)];
      }),
    ),
  };

  return (
    <nav
      aria-label={getMessages().chrome.header.mainMenu}
      className="hidden self-stretch lg:flex lg:items-center lg:gap-6"
    >
      <HeaderSectionLinks byPath={sectionsByPath} />

      <ul className="flex h-full items-center gap-8 text-sm font-medium text-white/85">
        {groups.map((item) => (
          <MegaMenuItem key={item.label} group={item} />
        ))}
      </ul>
    </nav>
  );
}
