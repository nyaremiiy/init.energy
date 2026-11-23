"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { HeroCopy } from "@/components/sections/hero/hero-copy";

import type { HeroSlide } from "./hero-slides";

type HeroContentSliderProps = {
  slide: HeroSlide;
  /** Pointer over the text (pauses rotation). */
  onHoverChange?: (hovered: boolean) => void;
  /** Keyboard focus inside the text (pauses rotation). */
  onFocusChange?: (focused: boolean) => void;
  /** Slide controls: outside the animated copy so focus survives a slide change. */
  controls?: ReactNode;
};

export function HeroContentSlider({ slide, onHoverChange, onFocusChange, controls }: HeroContentSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    // Phones: in the flow (flex-1 of the hero column) — same box as before while the copy fits, taller when it does not.
    <div className="relative z-10 flex flex-1 items-center overflow-hidden pt-28 pb-24 md:absolute md:inset-0 lg:pt-32 lg:pb-0">
      <Container inPanel>
        <div className="relative">
        {/* No aria-live: an auto-rotating slide would be read out every 10 s.
            Hover / focus pause only the text, not the controls (play must take effect at once). */}
        <div
          className="relative"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange?.(false);
          }}
        >
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
          {/* lg+: right end of the CTA row (bottom of the copy); below lg: own row under the buttons. */}
          {controls ? <div className="mt-6 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0">{controls}</div> : null}
        </div>
      </Container>
    </div>
  );
}
