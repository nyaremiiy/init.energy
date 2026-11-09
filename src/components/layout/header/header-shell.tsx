"use client";

import { useEffect, useState, type ReactNode } from "react";

const scrollThreshold = 8;

type HeaderShellProps = {
  topBar: ReactNode;
  mainBar: ReactNode;
};

export function HeaderShell({ topBar, mainBar }: HeaderShellProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > scrollThreshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      // At the top of the page the header sits inside the hero panel (same gap
      // as Panel); once scrolled it becomes a full-width bar.
      className={`group/header fixed z-30 isolate transition-all duration-300 ease-tech ${isScrolled ? "inset-x-0 top-0 lg:-translate-y-11" : "inset-x-panel-sm top-panel-sm sm:inset-x-panel sm:top-panel"}`}
    >
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 bg-slate-950/95 backdrop-blur-md transition-opacity duration-300 group-has-[[data-mega-menu][data-open=true]]/header:opacity-100 ${isScrolled ? "opacity-100" : "rounded-t-panel-sm opacity-0 sm:rounded-t-panel"}`}
      />
      <div
        className={`transition-opacity duration-300 ${isScrolled ? "lg:opacity-0" : ""}`}
        inert={isScrolled ? true : undefined}
      >
        {topBar}
      </div>
      <div className="relative">{mainBar}</div>
    </header>
  );
}
