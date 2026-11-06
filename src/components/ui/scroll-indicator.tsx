"use client";

import { Mouse } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type ScrollIndicatorProps = {
  className?: string;
};

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();

  function scrollToNextSection() {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Прокрутити до наступної секції"
      onClick={scrollToNextSection}
      className={`group relative flex cursor-pointer flex-col items-center text-white/70 transition duration-200 hover:-translate-y-1 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className ?? ""}`}
    >
      <motion.span
        aria-hidden
        animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
        transition={{
          duration: 1.6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Mouse className="size-6 transition-transform duration-200 group-hover:scale-110" />
      </motion.span>
      <span className="pointer-events-none absolute bottom-full mb-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest opacity-0 transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
        Гортайте далі
      </span>
    </button>
  );
}
