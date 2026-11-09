"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import type { HeroSlide } from "./hero-slides";
import { heroMediaTransitionDuration } from "./hero-slider.constants";

type HeroMediaSliderProps = {
  slide: HeroSlide;
  previousSlide?: HeroSlide;
};

type HeroMediaImageProps = {
  slide: HeroSlide;
};

const imagePositionClasses = {
  center: "object-center",
  top: "object-top",
};

function HeroMediaImage({ slide }: HeroMediaImageProps) {
  const imagePosition = imagePositionClasses[slide.image.position ?? "center"];

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
      {slide.image.laptop ? (
        <source
          media="(max-width: 1919px)"
          srcSet={slide.image.laptop}
          type={slide.image.type}
        />
      ) : null}
      {slide.image.type ? (
        <source srcSet={slide.image.desktop} type={slide.image.type} />
      ) : null}
      {/* The local responsive sources are already optimized for this hero. */}
      <img
        src={slide.image.fallback}
        alt=""
        className={`hero__image ${imagePosition}`}
      />
    </picture>
  );
}

export function HeroMediaSlider({
  slide,
  previousSlide,
}: HeroMediaSliderProps) {
  const prefersReducedMotion = useReducedMotion();
  // Parallax: the photo moves down at 30% of the page scroll (off with reduced motion).
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, (value) =>
    prefersReducedMotion ? 0 : value * 0.3,
  );

  return (
    <motion.div
      className="hero__media will-change-transform"
      style={{ y: parallaxY }}
      aria-hidden="true"
    >
      {previousSlide ? (
        <div className="absolute inset-0">
          <HeroMediaImage slide={previousSlide} />
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
        <HeroMediaImage slide={slide} />
      </motion.div>
    </motion.div>
  );
}
