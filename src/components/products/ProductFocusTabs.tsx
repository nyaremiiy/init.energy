"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { chipClasses } from "@/components/ui/chip-styles";
import { CardLabel } from "@/components/ui/card-label";
import { IconButton } from "@/components/ui/icon-button";
import { segmentIcons, type SegmentIconId } from "@/content/segments";
import { trackEvent } from "@/lib/analytics";

import { CapacityCard, type CapacityCardProps } from "./CapacityCard";

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
  capacityCard: CapacityCardProps;
  detailsLabel: string;
  specsLabel: string;
};

type ProductFocusTabsProps = {
  products: FocusProduct[];
  defaultIndex: number;
  labels: {
    tablist: string;
    compare: string;
  };
  compareHref: string;
  /**
   * Extra tab after a divider (partner brands): its panel comes from the server,
   * the timer skips it, and a strip under the SVIT panels switches to it.
   */
  extra?: {
    id: string;
    label: string;
    panel: ReactNode;
    strip: { brands: string[]; title: string; text: string };
  };
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
  extra,
}: ProductFocusTabsProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
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
  // The timer cycles through the products only; the extra tab is reached by choice.
  const next = (active + 1) % products.length;
  const tabCount = products.length + (extra ? 1 : 0);
  const extraIndex = products.length;

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

  function select(index: number, moveFocus: boolean) {
    setActive(index);
    setMode("stopped");
    if (moveFocus) tabRefs.current[index]?.focus();
    trackEvent({ event: "product_tab_select", product: index === extraIndex ? (extra?.id ?? "") : products[index].id });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = tabCount - 1;
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
          role="tablist"
          aria-label={labels.tablist}
          className="flex flex-wrap gap-2 py-1"
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
                className={`relative overflow-hidden ${chipClasses({ selected })}`}
              >
                {product.name}
                {/* Invisible timer: its animation end advances to the next tab. */}
                {selected && mode === "auto" ? (
                  <span
                    key={active}
                    aria-hidden
                    onAnimationEnd={() => setActive(next)}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left opacity-0"
                    style={{
                      animation: `tab-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ) : null}
              </button>
            );
          })}
          {extra ? (
            <>
              <span aria-hidden className="mx-1 w-px self-stretch bg-line" />
              <button
                ref={(element) => {
                  tabRefs.current[extraIndex] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${extraIndex}`}
                aria-selected={active === extraIndex}
                aria-controls={`${baseId}-panel-${extraIndex}`}
                tabIndex={active === extraIndex ? 0 : -1}
                onClick={() => select(extraIndex, false)}
                onKeyDown={onTabKeyDown}
                className={`${chipClasses({ selected: active === extraIndex })} ${active === extraIndex ? "" : "border-dashed"}`}
              >
                {extra.label}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* All panels stay in the HTML (SEO) and share one grid cell, so the
          height is set by the tallest product and never jumps. */}
      <div className="grid grid-cols-1">
        {products.map((product, index) => {
          const selected = index === active;

          return (
            <div
              key={product.id}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              tabIndex={selected ? 0 : -1}
              inert={!selected}
              className={`col-start-1 row-start-1 grid min-w-0 grid-cols-1 items-center gap-8 rounded-card bg-surface p-card-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:grid-cols-12 lg:gap-12 lg:p-card ${
                selected ? "motion-safe:animate-enter" : "invisible"
              }`}
            >
              <div className="min-w-0 lg:col-span-5">
                <CapacityCard {...product.capacityCard} />
              </div>

              <div className="flex min-w-0 flex-col items-start gap-6 lg:col-span-7">
                <CardLabel
                  tone="light"
                  icon={segmentIcons[product.segmentIcon]}
                >
                  {product.segment}
                </CardLabel>
                <h3 className="font-heading text-h2-sm font-semibold tracking-tight text-ink lg:text-h2-md">
                  {product.name}
                </h3>
                <p className="text-body leading-relaxed text-muted sm:text-lead">
                  {product.description}
                </p>

                <dl
                  aria-label={product.specsLabel}
                  className="grid w-full grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="group/spec flex min-w-0 flex-col-reverse gap-1 border-t border-line pt-4 transition-colors duration-200 ease-tech hover:border-faint"
                    >
                      <dt className="text-small text-muted transition-colors duration-200 ease-tech group-hover/spec:text-ink">
                        {spec.label}
                      </dt>
                      <dd className="font-heading text-stat-sm font-medium whitespace-nowrap text-ink transition-transform duration-200 ease-tech motion-safe:group-hover/spec:translate-x-1">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap gap-3">
                  <Button
                    href={product.href}
                    variant="dark"
                    icon={<ArrowUpRight aria-hidden className="size-4.5" />}
                  >
                    {product.detailsLabel}
                  </Button>
                  <Button href={compareHref} variant="outline-light">
                    {labels.compare}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {extra ? (
          <div
            role="tabpanel"
            id={`${baseId}-panel-${extraIndex}`}
            aria-labelledby={`${baseId}-tab-${extraIndex}`}
            tabIndex={active === extraIndex ? 0 : -1}
            inert={active !== extraIndex}
            className={`col-start-1 row-start-1 grid min-w-0 grid-cols-1 items-center gap-8 rounded-card bg-surface p-card-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:grid-cols-12 lg:gap-12 lg:p-card ${
              active === extraIndex ? "motion-safe:animate-enter" : "invisible"
            }`}
          >
            {extra.panel}
          </div>
        ) : null}
      </div>

      {/* «Потрібен інший бренд?» under every SVIT panel: switches to the brands tab and brings it into view. */}
      {extra ? (
        <button
          type="button"
          hidden={active === extraIndex}
          onClick={() => {
            select(extraIndex, true);
            tabRefs.current[extraIndex]?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion ? "auto" : "smooth" });
          }}
          className="group -mt-4 flex w-full cursor-pointer flex-col gap-4 rounded-card bg-ink-glow p-card-sm text-left text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:flex-row sm:items-center sm:gap-6 lg:-mt-8 lg:px-card lg:py-5"
        >
          <span aria-hidden className="flex shrink-0 flex-wrap gap-2">
            {extra.strip.brands.map((brand) => (
              <span key={brand} className="inline-flex h-8 items-center rounded-full border border-line-dark px-3 text-caption font-medium">
                {brand}
              </span>
            ))}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-heading text-body font-semibold">{extra.strip.title}</span>
            <span className="text-small text-muted-dark">{extra.strip.text}</span>
          </span>
          <IconButton decorative variant="solid-light" size="sm" icon="arrow" className="hidden shrink-0 sm:flex" />
        </button>
      ) : null}
    </div>
  );
}
