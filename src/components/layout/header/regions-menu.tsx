"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { chipClasses } from "@/components/ui/chip-styles";

/** Scroll distance at which the header hides the top bar (HeaderShell). */
const scrollThreshold = 8;

/**
 * «Регіони» in the header top bar: a disclosure button and a white panel with
 * the server-rendered region links (`children`). The panel is always in the
 * DOM (links in the HTML), hidden with `invisible` while closed. Closes on a
 * second click, Esc (focus back on the button), a click outside, a link,
 * another page, or scrolling (the top bar then hides).
 */
export function RegionsMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);
  // Another page: close (the header stays mounted between pages).
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onScroll = () => {
      if (window.scrollY > scrollThreshold) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onClick={(event) => {
        // A followed link closes the panel even when it is the current page.
        if ((event.target as Element).closest("a")) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`cursor-pointer ${chipClasses({ selected: open, tone: "dark", size: "compact" })}`}
      >
        <MapPin aria-hidden className="size-3.5 shrink-0" />
        {label}
        <ChevronDown aria-hidden className={`size-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        id={panelId}
        className={`absolute top-full left-0 z-40 pt-2 transition duration-200 ease-tech ${
          open ? "visible opacity-100" : "invisible opacity-0 motion-safe:translate-y-1.5"
        }`}
      >
        <div className="w-190 overflow-clip rounded-card bg-white text-ink shadow-soft">{children}</div>
      </div>
    </div>
  );
}
