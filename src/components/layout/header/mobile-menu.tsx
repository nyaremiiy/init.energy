"use client";

import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { formatPhone } from "@/lib/format";

import { useLocale, useMessages } from "@/i18n/client";

import {
  contactEmail,
  getNavItems,
  isHomePath,
  isNavGroup,
  type NavLink as NavLinkItem,
  offices,
  pageSectionLinks,
} from "./header-data";
import { LanguageSwitcher } from "./language-switcher";
import { goToLeadForm } from "./header-lead-cta";
import { MenuLink } from "./menu-link";
import { NavLink } from "./nav-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SocialLinks } from "@/components/ui/social-links";
import { Container } from "@/components/layout/container";
import { PillLink } from "@/components/ui/pill-link";

/** `regions`: the server-rendered «Регіони» switch and lists (RegionsPicker variant="mobile"). */
export function MobileMenu({ regions }: { regions?: ReactNode }) {
  const locale = useLocale();
  const t = useMessages().chrome.header;
  const navItems = getNavItems(locale);
  // Links to sections of the home page are shown only on the home page.
  const pathname = usePathname();
  const onHome = isHomePath(pathname);
  const pageLinks = pageSectionLinks(pathname, locale);
  // Solar and backup first, then the catalogue (as in the approved mockup).
  const groups = navItems
    .filter(isNavGroup)
    .filter((group) => group.kind !== "power")
    .toSorted((a, b) => Number(Boolean(b.footer.contacts)) - Number(Boolean(a.footer.contacts)));
  // Plant sizes: an accordion with pills, like «Регіони».
  const power = navItems.filter(isNavGroup).find((group) => group.kind === "power");
  const solutions = groups.find((group) => group.footer.contacts);
  // Links to sections of the current page (home sections or this page's anchors).
  const pageItems = onHome ? navItems.filter((item): item is NavLinkItem => !isNavGroup(item)) : pageLinks;
  // Page sections appear in the desktop header only from `wide` (1440 px); between lg and wide
  // the burger stays (after the CTA) so they remain reachable.
  const hasPageLinks = onHome || pageLinks.length > 0;
  const [isOpen, setIsOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const regionsId = useId();
  const [powerOpen, setPowerOpen] = useState(false);
  const powerId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        // The focused link disappears with the menu: return focus to the toggle.
        rootRef.current?.querySelector<HTMLElement>("[aria-controls='mobile-menu']")?.focus();
      }
    };

    // The menu covers the page: everything outside the header (main, footer,
    // floating buttons) leaves the Tab order and the accessibility tree.
    // Siblings on every level from the header up to <body> (English pages wrap it in <div lang="en">).
    const outside: HTMLElement[] = [];
    for (let node = rootRef.current?.closest("header") as Element | null | undefined; node && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement?.children ?? []) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) outside.push(sibling);
      }
    }
    outside.forEach((element) => {
      element.inert = true;
    });

    document.body.style.overflow = "hidden";
    // Floating call / back-to-top buttons sit above the header layer: hide them while the menu is open.
    document.body.dataset.menuOpen = "";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      outside.forEach((element) => {
        element.inert = false;
      });
      document.body.style.overflow = "";
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div ref={rootRef} className={hasPageLinks ? "wide:hidden" : "lg:hidden"}>
      <IconButton
        variant="outline-dark"
        size="sm"
        icon={isOpen ? "close" : "menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? t.closeMenu : t.openMenu}
        onClick={() => setIsOpen((value) => !value)}
        className="relative z-50"
      />

      {isOpen ? (
        <div
          id="mobile-menu"
          // The strip behind the header bar stays dark (white logo and buttons); the menu itself is a white sheet.
          className="fixed inset-0 z-40 bg-ink-glow"
        >
          {/* Only the sheet under the header bar scrolls: the logo and buttons stay on a solid background. */}
          <div className="absolute inset-x-0 top-20 bottom-0 overflow-y-auto overscroll-contain rounded-t-panel-sm bg-white pt-8 pb-10 text-ink lg:top-32">
            <Container className="flex min-h-full flex-col gap-8">
            <nav aria-label={t.mobileMenu} className="flex w-full max-w-2xl flex-col gap-8">
              {pageItems.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {pageItems.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        onClick={close}
                        className="-mx-2 flex min-h-11 items-center rounded-tile px-2 text-h3-sm font-semibold transition-colors duration-150 ease-tech active:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-ink"
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : null}

              {groups.flatMap((group) =>
                group.columns.map((column) => (
                  <section key={column.title} aria-label={column.title} className="flex flex-col gap-2">
                    <Eyebrow as="p">{group.columns.length > 1 ? column.title : group.label}</Eyebrow>
                    <ul className="-mx-2 flex flex-col gap-1">
                      {column.items.map((link) => (
                        <li key={link.href}>
                          <MenuLink link={link} onNavigate={close} tight />
                        </li>
                      ))}
                    </ul>
                  </section>
                )),
              )}

              {power ? (
                <section aria-label={t.menu.powerMobile} className="flex flex-col gap-2">
                  <button
                    type="button"
                    aria-expanded={powerOpen}
                    aria-controls={powerId}
                    onClick={() => setPowerOpen((value) => !value)}
                    className="-mx-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-tile px-2 transition-colors duration-150 ease-tech active:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-ink"
                  >
                    <Eyebrow as="span">{t.menu.powerMobile}</Eyebrow>
                    <ChevronDown aria-hidden className={`size-4 shrink-0 transition-transform duration-200 ${powerOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id={powerId} hidden={!powerOpen} className="flex flex-col gap-4 pt-2">
                    {power.columns.map((column) => (
                      <div key={column.title} className="flex flex-col gap-2">
                        <p className="text-small text-muted">{column.title}</p>
                        <ul className="flex flex-wrap gap-2">
                          {column.items.map((link) => (
                            <li key={link.href}>
                              <PillLink href={link.href} size="compact" onClick={close}>
                                {link.label}
                              </PillLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {regions ? (
                <section aria-label={t.regions.button} className="flex flex-col gap-2">
                  <button
                    type="button"
                    aria-expanded={regionsOpen}
                    aria-controls={regionsId}
                    onClick={() => setRegionsOpen((value) => !value)}
                    className="-mx-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-tile px-2 transition-colors duration-150 ease-tech active:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-ink"
                  >
                    <Eyebrow as="span">{t.regions.button}</Eyebrow>
                    <ChevronDown aria-hidden className={`size-4 shrink-0 transition-transform duration-200 ${regionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id={regionsId} hidden={!regionsOpen} className="-mx-2">
                    {regions}
                  </div>
                </section>
              ) : null}
            </nav>

            <div className="flex w-full max-w-2xl flex-col items-start gap-4 rounded-card bg-surface p-card-sm">
              <p className="text-small text-muted">{solutions?.footer.text}</p>
              {solutions ? (
                <Button
                  href={solutions.footer.href}
                  variant="dark"
                  onClick={(event) => {
                    goToLeadForm(event);
                    close();
                  }}
                  icon={<ArrowUpRight aria-hidden className="size-4.5" />}
                >
                  {solutions.footer.label}
                </Button>
              ) : null}
            </div>

            <div className="flex flex-col gap-6 text-small text-muted">
              {offices.map((office) => (
                <address key={office.id} className="flex flex-col gap-2 not-italic">
                  <span className="inline-flex items-center gap-2">
                    <MapPin aria-hidden className="size-4 shrink-0" />
                    {office.city[locale]}, {office.address[locale]}
                  </span>
                  {office.phone ? (
                    <a href={office.phone.href} className="inline-flex min-h-11 items-center gap-2 hover:text-ink">
                      <Phone aria-hidden className="size-4 shrink-0" />
                      {formatPhone(office.phone.display)}
                    </a>
                  ) : null}
                </address>
              ))}
              <a href={`mailto:${contactEmail}`} className="inline-flex min-h-11 items-center gap-2 hover:text-ink">
                <Mail aria-hidden className="size-4 shrink-0" />
                {contactEmail}
              </a>
            </div>

            <SocialLinks tone="light" iconClassName="size-6" className="gap-5" />

            <LanguageSwitcher tone="light" className="mt-auto" />
            </Container>
          </div>
        </div>
      ) : null}
    </div>
  );
}
