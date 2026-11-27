"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useMessages } from "@/i18n/client";

/** Scroll distance (px) after which the button appears. */
const SHOW_AFTER_PX = 600;

/** Fixed round button at the bottom-right that scrolls back to the top. */
export function BackToTop() {
  const label = useMessages().chrome.backToTop;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={scrollToTop}
      // Hidden: out of the Tab order and the accessibility tree (it was still read while transparent).
      inert={!visible}
      // Light ring: the ink button stays visible on dark sections (hero, panels, footer).
      data-floating
      className={`fixed right-panel-sm bottom-20 z-40 inline-flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-soft ring-1 ring-faint-dark transition-all duration-200 ease-tech hover:bg-navy hover:ring-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:right-panel sm:bottom-24 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUpRight aria-hidden className="size-4.5 -rotate-45" />
    </button>
  );
}
