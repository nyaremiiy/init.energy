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
      className={`flex flex-col items-center gap-2 text-white/70 transition duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className ?? ""}`}
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
        <Mouse className="size-6" />
      </motion.span>
    </button>
  );
}
