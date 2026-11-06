"use client";

import { MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { offices, officeRotationInterval } from "./header-data";

export function OfficeRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const office = offices[activeIndex];

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % offices.length),
      officeRotationInterval,
    );

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  return (
    <div
      className="relative h-4 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.address
          key={office.id}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="flex items-center gap-6 not-italic"
        >
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            <span>
              {office.city}, {office.address}
            </span>
          </span>
          <a
            href={office.phone.href}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone aria-hidden className="size-3.5 shrink-0" />
            {office.phone.display}
          </a>
        </motion.address>
      </AnimatePresence>
    </div>
  );
}
