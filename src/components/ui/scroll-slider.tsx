"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollSliderProps = {
  /** Accessible name of the list. */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Items rendered as `<li>`; width is set by the slider. */
  children: ReactNode[];
};

const buttonClasses =
  "inline-flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-200 ease-tech hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-40";

/**
 * Horizontal scroll-snap row: swipe on touch screens, arrow buttons from lg.
 * Shows 1.2 cards on mobile, 2 on md and 3 on lg.
 */
export function ScrollSlider({
  label,
  previousLabel,
  nextLabel,
  children,
}: ScrollSliderProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanPrev(list.scrollLeft > 4);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scrollByCard(direction: 1 | -1) {
    const list = listRef.current;
    const item = list?.querySelector("li");
    if (!list || !item) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollBy({
      left: direction * (item.getBoundingClientRect().width + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ul
        ref={listRef}
        aria-label={label}
        className="scrollbar-none -mx-2.5 -my-2 flex snap-x snap-mandatory scroll-px-2.5 gap-4 overflow-x-auto px-2.5 py-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {children.map((child, index) => (
          <li
            key={index}
            className="w-5/6 shrink-0 snap-start md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            {child}
          </li>
        ))}
      </ul>

      <div className="hidden justify-end gap-2 lg:flex">
        <button
          type="button"
          aria-label={previousLabel}
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
          className={buttonClasses}
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
          className={buttonClasses}
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
