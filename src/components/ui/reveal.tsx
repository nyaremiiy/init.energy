"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds, e.g. for staggering cards. */
  delay?: number;
  /** Lift distance in px. */
  distance?: number;
  /** Duration in seconds. */
  duration?: number;
};

/**
 * Fades and lifts content in once when it scrolls into view
 * (IntersectionObserver via Motion `whileInView`, runs a single time).
 *
 * One render path on server and client: the SSR markup carries the initial
 * `opacity: 0`, so swapping to a plain <div> for reduced motion left the
 * content invisible after hydration. Reduced motion is handled in CSS instead
 * (`[data-reveal]` in globals.css forces the final state).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  duration = 0.6,
}: RevealProps) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
