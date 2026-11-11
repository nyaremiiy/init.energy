"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { NavGroup } from "./header-data";
import { MegaMenuPanel } from "./mega-menu-panel";

/** Time the menu stays open after the pointer leaves, so it can be reached. */
const CLOSE_DELAY_MS = 250;

export function MegaMenuItem({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  function cancelClose() {
    window.clearTimeout(timer.current);
  }

  function openMenu() {
    cancelClose();
    setOpen(true);
  }

  function closeLater() {
    cancelClose();
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function closeNow() {
    cancelClose();
    setOpen(false);
  }

  useEffect(() => cancelClose, []);

  return (
    <li
      data-mega-menu
      data-open={open}
      className="group flex h-full items-center"
      onMouseEnter={openMenu}
      onMouseLeave={closeLater}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeLater();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          cancelClose();
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 whitespace-nowrap underline underline-offset-8 transition-colors hover:text-white hover:decoration-white focus-visible:text-white ${open ? "text-white decoration-white" : "decoration-transparent"}`}
      >
        {group.label}
        <ChevronDown
          aria-hidden
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <MegaMenuPanel group={group} open={open} onNavigate={closeNow} />
    </li>
  );
}
