"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/layout/container";
import { HeroCopy } from "@/components/sections/hero/hero-copy";

import type { HeroSlide } from "./hero-slides";

type HeroContentSliderProps = {
  slide: HeroSlide;
};

export function HeroContentSlider({ slide }: HeroContentSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-10 flex items-center overflow-hidden pt-28 pb-24 lg:pt-32 lg:pb-0">
      <Container inPanel>
        <div className="relative" aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={slide.id}
              initial={
                prefersReducedMotion ? false : { opacity: 0, x: "100vw" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: "-100vw" }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: "easeOut",
              }}
            >
              <HeroCopy
                id={slide.id}
                eyebrow={slide.label}
                lines={slide.heading}
                headingLevel={slide.headingLevel}
                description={slide.description}
                actions={slide.actions}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
