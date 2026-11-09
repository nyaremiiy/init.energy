"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SectionNavLinkProps = {
  href: string;
  label: string;
  sectionId: string;
};

/**
 * Header link that lights up (white pill) while its home section is in the
 * middle band of the viewport. Uses IntersectionObserver; no scroll listeners.
 */
export function SectionNavLink({ href, label, sectionId }: SectionNavLinkProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: "-45% 0px -45% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId]);

  return (
    <Link
      href={href}
      aria-current={isActive ? "location" : undefined}
      className={`inline-flex items-center rounded-full px-3 py-1.5 transition-colors duration-200 ease-tech ${isActive ? "bg-white text-ink" : "text-white/85 hover:text-white"}`}
    >
      {label}
    </Link>
  );
}
