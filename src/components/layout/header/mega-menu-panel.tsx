"use client";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

import { useLocale } from "@/i18n/client";

import { getNavCta, type NavGroup } from "./header-data";
import { NavLink } from "./nav-link";

type MegaMenuPanelProps = {
  group: NavGroup;
  open: boolean;
  /** Closes the menu when a link in it is followed. */
  onNavigate: () => void;
};

export function MegaMenuPanel({ group, open, onNavigate }: MegaMenuPanelProps) {
  const navCta = getNavCta(useLocale());
  return (
    <div
      className={`absolute inset-x-0 top-full transition duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="rounded-b-3xl border-y border-white/15 bg-ink-glow shadow-soft">
        <Container className="flex gap-10 py-10">
          <div className="grid flex-1 auto-cols-fr grid-flow-col gap-10">
            {group.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <Eyebrow tone="dark" as="p">
                  {column.title}
                </Eyebrow>
                {/* Items are tiles: hover / keyboard focus light up the background (white/8). */}
                <ul className="-mx-3 flex flex-col gap-1">
                  {column.items.map((link) => (
                    <li key={link.href}>
                      <NavLink
                        href={link.href}
                        className="group/link flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-150 ease-tech hover:bg-white/8 focus-visible:bg-white/8 focus-visible:outline-2 focus-visible:outline-white/60"
                        onClick={onNavigate}
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="text-base font-semibold text-white/90 transition-colors duration-150 ease-tech group-hover/link:text-white group-focus-visible/link:text-white">
                            {link.label}
                          </span>
                          <span className="text-sm text-white/70 transition-colors duration-150 ease-tech group-hover/link:text-white/85 group-focus-visible/link:text-white/85">
                            {link.description}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-white opacity-0 transition duration-150 ease-tech group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5"
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex w-80 flex-col items-start gap-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="text-lg font-semibold text-white">{navCta.title}</p>
            <p className="text-sm text-white/65">{navCta.text}</p>
            <Button
              href={navCta.href}
              className="mt-2"
              onClick={onNavigate}
              icon={<ArrowUpRight aria-hidden className="size-4" />}
            >
              {navCta.label}
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
