"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { chipClasses } from "@/components/ui/chip-styles";
import { CardLabel } from "@/components/ui/card-label";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { segmentIcons, type SegmentIconId } from "@/content/segments";
import { trackEvent } from "@/lib/analytics";

/** How long each product stays in focus before the next one, ms. */
const AUTO_ADVANCE_MS = 6000;

export type FocusProduct = {
  id: string;
  name: string;
  href: string;
  segment: string;
  segmentIcon: SegmentIconId;
  description: string;
  specs: { label: string; value: string }[];
  image?: { src: string; alt: string; width: number; height: number };
  detailsLabel: string;
  specsLabel: string;
  photoPending: string;
};

type ProductFocusTabsProps = {
  products: FocusProduct[];
  defaultIndex: number;
  labels: {
    tablist: string;
    compare: string;
  };
  compareHref: string;
};

/**
 * "auto" — advances on a timer; "paused" — reduced motion only; "stopped" — the visitor picked a
 * tab, so the carousel never moves on its own again (until reload).
 */
type Mode = "auto" | "paused" | "stopped";

export function ProductFocusTabs({
  products,
  defaultIndex,
  labels,
  compareHref,
}: ProductFocusTabsProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(defaultIndex);
  // null until the visitor picks a tab; reduced motion starts paused, others on auto.
  const [chosenMode, setMode] = useState<Mode | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const mode: Mode = chosenMode ?? (prefersReducedMotion ? "paused" : "auto");
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const running =
    mode === "auto" && inView && !hovered && !focused && pageVisible;
  const next = (active + 1) % products.length;

  // Start only while the section is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Pause while the browser tab is in the background.
  useEffect(() => {
    const onChange = () =>
      setPageVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // Keep the active tab visible in the scrollable row without moving the page.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab) return;
    const left = tab.offsetLeft - list.offsetLeft;
    if (
      left < list.scrollLeft ||
      left + tab.offsetWidth > list.scrollLeft + list.clientWidth
    ) {
      list.scrollTo({ left, behavior: "smooth" });
    }
  }, [active]);

  function select(index: number, moveFocus: boolean) {
    setActive(index);
    setMode("stopped");
    if (moveFocus) tabRefs.current[index]?.focus();
    trackEvent({ event: "product_tab_select", product: products[index].id });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = products.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-8 lg:gap-12"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
    >
      <div>
        <div
          ref={listRef}
          role="tablist"
          aria-label={labels.tablist}
          className="scrollbar-none -mx-2.5 flex min-w-0 flex-1 snap-x snap-mandatory scroll-px-2.5 gap-2 overflow-x-auto px-2.5 py-1 sm:mx-0 sm:px-0"
        >
          {products.map((product, index) => {
            const selected = index === active;

            return (
              <button
                key={product.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index, false)}
                onKeyDown={onTabKeyDown}
                className={`relative snap-start overflow-hidden ${chipClasses({ selected, tone: "dark" })}`}
              >
                {product.name}
                {selected && mode === "auto" ? (
                  <span
                    key={active}
                    aria-hidden
                    onAnimationEnd={() => setActive(next)}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink"
                    style={{
                      animation: `tab-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* All panels stay in the HTML (SEO) and share one grid cell, so the
          height is set by the tallest product and never jumps. */}
      <div className="grid">
        {products.map((product, index) => {
          const selected = index === active;
          const eager = selected || index === next;

          return (
            <div
              key={product.id}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              tabIndex={selected ? 0 : -1}
              inert={!selected}
              className={`col-start-1 row-start-1 grid items-center gap-8 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:grid-cols-2 lg:gap-16 ${
                selected ? "motion-safe:animate-enter" : "invisible"
              }`}
            >
              {product.image ? (
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/6">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    // Product photos are already optimized AVIF: serve the file as is, without
                    // Next re-encoding (which costs quality).
                    unoptimized
                    loading={eager ? "eager" : "lazy"}
                    sizes="(min-width: 1440px) 640px, (min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <MediaPlaceholder
                  tone="dark"
                  caption={product.photoPending}
                  className="aspect-square w-full rounded-3xl"
                />
              )}

              <div className="flex flex-col items-start gap-6">
                <CardLabel
                  tone="dark"
                  icon={segmentIcons[product.segmentIcon]}
                  className="border-white text-white"
                >
                  {product.segment}
                </CardLabel>
                <h3 className="font-heading text-4xl font-semibold tracking-tight text-white lg:text-6xl">
                  {product.name}
                </h3>
                <p className="text-lg leading-relaxed text-white/75">
                  {product.description}
                </p>

                <dl
                  aria-label={product.specsLabel}
                  className="grid w-full gap-4 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3"
                >
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex flex-col-reverse gap-1 border-t border-white/16 pt-4"
                    >
                      <dt className="text-sm text-white/75">{spec.label}</dt>
                      <dd className="font-heading text-2xl font-medium whitespace-nowrap text-white">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap gap-3">
                  <Button
                    href={product.href}
                    icon={<ArrowUpRight aria-hidden className="size-4.5" />}
                  >
                    {product.detailsLabel}
                  </Button>
                  <Button href={compareHref} variant="secondary">
                    {labels.compare}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
