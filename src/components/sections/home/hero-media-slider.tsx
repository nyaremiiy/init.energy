"use client";

import { motion, useReducedMotion } from "motion/react";

import { HeroParallax } from "@/components/sections/hero/hero-parallax";
import { HeroPicture } from "@/components/sections/hero/hero-picture";

import type { HeroSlide } from "./hero-slides";
import { heroMediaTransitionDuration } from "./hero-slider.constants";

type HeroMediaSliderProps = {
  slide: HeroSlide;
  previousSlide?: HeroSlide;
};

export function HeroMediaSlider({
  slide,
  previousSlide,
}: HeroMediaSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <HeroParallax>
      {previousSlide ? (
        <div className="absolute inset-0">
          <HeroPicture image={previousSlide.image} />
        </div>
      ) : null}
      <motion.div
        key={slide.id}
        initial={
          previousSlide && !prefersReducedMotion ? { opacity: 0 } : false
        }
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : heroMediaTransitionDuration,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10"
      >
        <HeroPicture image={slide.image} />
      </motion.div>
    </HeroParallax>
  );
}
