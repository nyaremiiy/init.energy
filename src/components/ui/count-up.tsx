"use client";

import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/i18n/client";
import { formatNumber } from "@/lib/format";

const DURATION_MS = 800;

/**
 * A number that counts up from 0 once, when it scrolls into view (≈ 800 ms).
 * The HTML has the final value; a number already on screen at load, and every
 * number with reduced motion, does not move. Screen readers get the final value.
 */
export function CountUp({ value }: { value: number }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = first && entry.isIntersecting;
      first = false;
      if (wasVisible) return observer.disconnect();
      if (!entry.isIntersecting) {
        setShown(0);
        return;
      }
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        // Ease-out cubic; whole numbers until the end, then the exact value.
        const eased = 1 - (1 - progress) ** 3;
        setShown(progress < 1 ? Math.round(value * eased) : value);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span aria-hidden>{formatNumber(shown, locale)}</span>
      <span className="sr-only">{formatNumber(value, locale)}</span>
    </span>
  );
}
