"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * Media layer of the hero: fills the panel and moves down at 30% of the
 * page scroll (off with reduced motion). Decorative: hidden from assistive tech.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value) => (prefersReducedMotion ? 0 : value * 0.3));

  return (
    <motion.div className="hero__media will-change-transform" style={{ y }} aria-hidden="true">
      {children}
    </motion.div>
  );
}
