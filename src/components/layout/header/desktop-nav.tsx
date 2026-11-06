import { ChevronDown } from "lucide-react";

import { isNavGroup, navItems } from "./header-data";
import { NavLink } from "./nav-link";

export function DesktopNav() {
  return (
    <nav aria-label="Головне меню" className="hidden lg:block">
      <ul className="flex items-center gap-8 text-sm font-medium text-white/85">
        {navItems.map((item) =>
          isNavGroup(item) ? (
            <li key={item.label} className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 py-2 transition-colors group-focus-within:text-white group-hover:text-white"
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                />
              </button>
              <div className="invisible absolute top-full left-0 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="flex w-max max-w-xs flex-col gap-1 rounded-2xl bg-slate-950/95 p-3 shadow-xl ring-1 ring-white/10 backdrop-blur-md">
                  {item.items.map((link) => (
                    <li key={link.href}>
                      <NavLink
                        href={link.href}
                        className="block rounded-xl px-3 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ) : (
            <li key={item.href}>
              <NavLink href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
