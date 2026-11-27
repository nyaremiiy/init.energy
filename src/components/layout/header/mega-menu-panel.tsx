"use client";

import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

import type { NavGroup } from "./header-data";
import { goToLeadForm } from "./header-lead-cta";
import { MenuLink } from "./menu-link";

type MegaMenuPanelProps = {
  id: string;
  group: NavGroup;
  open: boolean;
  /** Closes the menu when a link in it is followed. */
  onNavigate: () => void;
};

/**
 * Compact light dropdown under its menu item (owner's decision 2026-11-25,
 * replaces the full-width dark panel): white card, columns of links and a
 * bottom row with one action. Aligned to the item's left edge and pushed back
 * inside the header container when it would run past its right edge.
 */
export function MegaMenuPanel({ id, group, open, onNavigate }: MegaMenuPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const twoColumns = group.columns.length > 1;

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const root = rootRef.current;
      const bar = root?.closest("[data-header-bar]");
      if (!root || !bar) return;
      const style = getComputedStyle(bar);
      const barRect = bar.getBoundingClientRect();
      const right = barRect.right - parseFloat(style.paddingRight);
      const left = barRect.left + parseFloat(style.paddingLeft);
      const anchor = (root.parentElement ?? root).getBoundingClientRect().left;
      const width = root.offsetWidth;
      setShift(Math.max(left - anchor, Math.min(0, right - (anchor + width))));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  return (
    <div
      ref={rootRef}
      id={id}
      style={{ left: shift }}
      // pt-3 is a transparent bridge: the pointer reaches the panel without leaving the item.
      className={`absolute top-full z-40 pt-3 transition duration-200 ease-tech ${twoColumns ? "w-160" : "w-104"} ${
        open ? "visible opacity-100" : "invisible opacity-0 motion-safe:translate-y-1.5"
      }`}
    >
      <div className="overflow-clip rounded-card bg-white text-ink shadow-soft">
        <div className={`grid gap-4 p-5 ${twoColumns ? "grid-cols-2" : "grid-cols-1"}`}>
          {group.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 px-3 pb-1">
                <Eyebrow as="p">{column.title}</Eyebrow>
                {column.caption ? <p className="text-caption text-muted">{column.caption}</p> : null}
              </div>
              <ul className="flex flex-col gap-1">
                {column.items.map((link) => (
                  <li key={link.href}>
                    <MenuLink link={link} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The button moves under the text only when both do not fit (one-column panels with a long button). */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-surface px-8 py-4">
          <p className="grow basis-32 text-small text-muted">{group.footer.text}</p>
          <Button
            href={group.footer.href}
            variant="dark"
            size="sm"
            className="shrink-0"
            onClick={(event) => {
              if (group.footer.contacts) goToLeadForm(event);
              onNavigate();
            }}
            icon={<ArrowUpRight aria-hidden className="size-4" />}
          >
            {group.footer.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
