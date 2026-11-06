"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";

import { format } from "@/lib/messages";

import { ProductCard } from "./product-card";

type CarouselItem = Omit<ComponentProps<typeof ProductCard>, "tone"> & {
  id: string;
};

type ProductCarouselProps = {
  items: CarouselItem[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  /** Template with {current} and {total}. */
  slideLabel: string;
};

/** Visible cards per breakpoint: 1 (mobile), 2 (md), 3 (lg). */
function getVisibleCount() {
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
}

/** The third visible card is always the dark accent card (desktop). */
const accentPosition = 2;

export function ProductCarousel({
  items,
  label,
  prevLabel,
  nextLabel,
  slideLabel,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(3);

  const update = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;

    if (!track || !first) return;

    setVisible(getVisibleCount());
    setStart(Math.round(track.scrollLeft / first.offsetWidth));
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    update();
    track?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      track?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;

    if (!track || !first) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * first.offsetWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const lastStart = Math.max(0, items.length - visible);
  const accentIndex = visible >= 3 ? start + accentPosition : -1;
  const arrowClasses =
    "inline-flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-end gap-3">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => scrollByCards(-1)}
          disabled={start <= 0}
          className={arrowClasses}
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => scrollByCards(1)}
          disabled={start >= lastStart}
          className={arrowClasses}
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>

      <ul
        ref={trackRef}
        className="scrollbar-none -mx-2 -my-2 flex snap-x snap-mandatory overflow-x-auto py-2 scroll-smooth motion-reduce:scroll-auto"
      >
        {items.map(({ id, ...card }, index) => (
          <li
            key={id}
            role="group"
            aria-roledescription="slide"
            aria-label={format(slideLabel, {
              current: String(index + 1),
              total: String(items.length),
            })}
            className="w-full shrink-0 snap-start px-2 md:w-1/2 lg:w-1/3"
          >
            <ProductCard
              {...card}
              tone={index === accentIndex ? "dark" : "light"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
