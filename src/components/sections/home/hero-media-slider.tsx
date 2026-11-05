"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import type { HeroSlide } from "./hero-slides";
import { heroMediaTransitionDuration } from "./hero-slider.constants";

type HeroMediaSliderProps = {
  slide: HeroSlide;
  previousSlide?: HeroSlide;
};

type HeroMediaImageProps = {
  slide: HeroSlide;
};

function HeroMediaImage({ slide }: HeroMediaImageProps) {
  if (slide.image.optimized) {
    return (
      <Image
        src={slide.image.desktop}
        alt=""
        fill
        sizes="100vw"
        preload={slide.id === "hero-title"}
        className="object-cover object-center"
      />
    );
  }

  return (
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
  );
}

export function HeroMediaSlider({
  slide,
  previousSlide,
}: HeroMediaSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hero__media" aria-hidden="true">
      {previousSlide ? (
        <div className="absolute inset-0">
          <HeroMediaImage slide={previousSlide} />
        </div>
      ) : null}
      <motion.div
        key={slide.id}
        initial={previousSlide && !prefersReducedMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : heroMediaTransitionDuration,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10"
      >
        <HeroMediaImage slide={slide} />
      </motion.div>
    </div>
  );
}
