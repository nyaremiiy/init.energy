"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * Marks a block for CSS grow-in animations (`.grow-y`, `.grow-x` in globals.css).
 * The server HTML has no attribute — the final state, also without JS. Only a
 * block that starts below the fold gets data-inview="false" and animates when
 * it comes into view; with reduced motion the CSS does nothing.
 */
export function InView({ ...props }: ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.inview = "true";
          observer.disconnect();
        } else if (first) {
          node.dataset.inview = "false";
        }
        first = false;
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} {...props} />;
}
