"use client";

import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { formatPhone } from "@/lib/format";

import { useLocale, useMessages } from "@/i18n/client";

import {
  contactEmail,
  getNavItems,
  isHomePath,
  isNavGroup,
  offices,
} from "./header-data";
import { LanguageSwitcher } from "./language-switcher";
import { NavLink } from "./nav-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SocialLinks } from "@/components/ui/social-links";

export function MobileMenu() {
  const locale = useLocale();
  const t = useMessages().chrome.header;
  const navItems = getNavItems(locale);
  // Links to sections of the home page are shown only on the home page.
  const onHome = isHomePath(usePathname());
  const visibleItems = onHome
    ? navItems
    : navItems.filter((item) => isNavGroup(item) || !item.sectionId);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? t.closeMenu : t.openMenu}
        onClick={() => setIsOpen((value) => !value)}
        className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
      >
        {isOpen ? (
          <X aria-hidden className="size-5" />
        ) : (
          <Menu aria-hidden className="size-5" />
        )}
      </button>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col gap-10 overflow-y-auto bg-ink-glow px-4.5 pt-28 pb-10 text-white sm:px-8"
        >
          <nav aria-label={t.mobileMenu}>
            <ul className="flex flex-col gap-5 text-2xl font-semibold">
              {visibleItems.map((item) =>
                isNavGroup(item) ? (
                  <li key={item.label}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className="size-6 transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <div className="mt-5 flex flex-col gap-6 border-l border-white/15 pl-4">
                        {item.columns.map((column) => (
                          <div
                            key={column.title}
                            className="flex flex-col gap-3"
                          >
                            <Eyebrow tone="dark" as="p">
                              {column.title}
                            </Eyebrow>
                            <ul className="flex flex-col gap-4">
                              {column.items.map((link) => (
                                <li key={link.href}>
                                  <NavLink
                                    href={link.href}
                                    onClick={close}
                                    className="flex flex-col gap-1"
                                  >
                                    <span className="text-base font-semibold">
                                      {link.label}
                                    </span>
                                    <span className="text-sm font-normal text-white/70">
                                      {link.description}
                                    </span>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </details>
                  </li>
                ) : (
                  <li key={item.href}>
                    <NavLink href={item.href} onClick={close}>
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex flex-col gap-6 text-sm text-white/80">
            {offices.map((office) => (
              <address
                key={office.id}
                className="flex flex-col gap-2 not-italic"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin aria-hidden className="size-4 shrink-0" />
                  {office.city[locale]}, {office.address[locale]}
                </span>
                <a
                  href={office.phone.href}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone aria-hidden className="size-4 shrink-0" />
                  {formatPhone(office.phone.display)}
                </a>
              </address>
            ))}
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <Mail aria-hidden className="size-4 shrink-0" />
              {contactEmail}
            </a>
          </div>

          <SocialLinks iconClassName="size-6" className="gap-5" />

          <LanguageSwitcher className="mt-auto" />
        </div>
      ) : null}
    </div>
  );
}
