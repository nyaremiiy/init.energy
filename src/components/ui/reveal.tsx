"use client";

import { motion, useReducedMotion } from "motion/react";
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
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  duration = 0.6,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
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
