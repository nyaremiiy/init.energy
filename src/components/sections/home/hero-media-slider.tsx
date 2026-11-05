"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { HeroSlide } from "./hero-slides";

type HeroMediaSliderProps = {
  slide: HeroSlide;
};

const mediaTransitionDuration = 1.2;

export function HeroMediaSlider({ slide }: HeroMediaSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hero__media" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : mediaTransitionDuration,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          <picture className="block size-full">
            {slide.image.mobile ? (
              <source
                media="(max-width: 767px)"
                srcSet={slide.image.mobile}
                type={slide.image.type}
              />
            ) : null}
            {slide.image.tablet ? (
              <source
                media="(max-width: 1279px)"
                srcSet={slide.image.tablet}
                type={slide.image.type}
              />
            ) : null}
            {slide.image.type ? (
              <source srcSet={slide.image.desktop} type={slide.image.type} />
            ) : null}
            {/* The local responsive sources are already optimized for this hero. */}
            <img src={slide.image.fallback} alt="" className="hero__image" />
          </picture>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
