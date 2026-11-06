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
      className={`group/header fixed inset-x-0 top-0 z-30 isolate transition-transform duration-300 ease-out ${isScrolled ? "lg:-translate-y-11" : ""}`}
    >
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 bg-slate-950/95 shadow-lg backdrop-blur-md transition-opacity duration-300 group-has-[[data-mega-menu]:hover]/header:opacity-100 group-has-[[data-mega-menu]:focus-within]/header:opacity-100 ${isScrolled ? "opacity-100" : "opacity-0"}`}
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
