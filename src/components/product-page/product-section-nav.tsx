"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { chipClasses } from "@/components/ui/chip-styles";

type ProductSectionNavProps = {
  label: string;
  items: { id: string; label: string }[];
  productName: string;
  cta: { href: string; label: string };
  /** id of the hero; the bar appears once it has scrolled away. */
  heroId: string;
};

/**
 * In-page navigation fixed under the site header after the hero. The active
 * link follows the section in view.
 */
export function ProductSectionNav({
  label,
  items,
  productName,
  cta,
  heroId,
}: ProductSectionNavProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);
    // A section is active while it crosses the band just under the bars.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div
      className={`fixed inset-x-0 top-20 z-20 border-b border-line bg-white transition duration-300 ease-tech ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      inert={visible ? undefined : true}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <nav aria-label={label} className="hidden min-w-0 lg:block">
          <ul className="flex gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={chipClasses({ selected: active === item.id })}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 lg:flex-none">
          <span className="truncate font-heading text-base font-semibold text-ink lg:hidden xl:inline">
            {productName}
          </span>
          <Button
            href={cta.href}
            variant="dark"
            icon={<ArrowUpRight aria-hidden className="size-4.5" />}
          >
            {cta.label}
          </Button>
        </div>
      </Container>
    </div>
  );
}
