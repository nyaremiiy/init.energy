"use client";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

import { useLocale } from "@/i18n/client";

import { getNavCta, type NavGroup } from "./header-data";
import { NavLink } from "./nav-link";

type MegaMenuPanelProps = {
  id: string;
  group: NavGroup;
  open: boolean;
  /** Closes the menu when a link in it is followed. */
  onNavigate: () => void;
};

export function MegaMenuPanel({ id, group, open, onNavigate }: MegaMenuPanelProps) {
  const navCta = getNavCta(useLocale());
  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full transition duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="rounded-b-3xl border-y border-line-dark bg-ink-glow shadow-soft">
        <Container className="flex gap-10 py-10">
          <div className="grid flex-1 auto-cols-fr grid-flow-col gap-10">
            {group.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <Eyebrow tone="dark" as="p">
                  {column.title}
                </Eyebrow>
                {/* Items are tiles: hover / keyboard focus light up the background (fill-dark). */}
                <ul className="-mx-3 flex flex-col gap-1">
                  {column.items.map((link) => (
                    <li key={link.href}>
                      <NavLink
                        href={link.href}
                        className="group/link flex items-start gap-3 rounded-tile px-3 py-2.5 transition-colors duration-150 ease-tech hover:bg-fill-dark focus-visible:bg-fill-dark focus-visible:outline-2 focus-visible:outline-white"
                        onClick={onNavigate}
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="text-body font-semibold text-white transition-colors duration-150 ease-tech group-hover/link:text-white group-focus-visible/link:text-white">
                            {link.label}
                          </span>
                          <span className="text-small text-muted-dark transition-colors duration-150 ease-tech group-hover/link:text-muted-dark group-focus-visible/link:text-muted-dark">
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

          <div className="flex w-80 shrink-0 flex-col items-start gap-3 self-start rounded-tile bg-fill-dark p-6 ring-1 ring-line-dark">
            <p className="text-lead font-semibold text-white">{navCta.title}</p>
            <p className="text-small text-muted-dark">{navCta.text}</p>
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
