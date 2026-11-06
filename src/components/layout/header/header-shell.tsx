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
      className={`fixed inset-x-0 top-0 z-30 transition-transform duration-300 ease-out ${isScrolled ? "lg:-translate-y-11" : ""}`}
    >
      <div
        className={`transition-opacity duration-300 ${isScrolled ? "lg:opacity-0" : ""}`}
        inert={isScrolled ? true : undefined}
      >
        {topBar}
      </div>
      <div className="relative isolate">
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 bg-slate-950/85 shadow-lg backdrop-blur-md transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`}
        />
        {mainBar}
      </div>
    </header>
  );
}
