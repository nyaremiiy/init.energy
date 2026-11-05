"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { HeroContentSlider } from "./hero-content-slider";
import { HeroMediaSlider } from "./hero-media-slider";
import { heroSlides } from "./hero-slides";

const slideInterval = 10000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % heroSlides.length),
      slideInterval,
    );

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  return (
    <>
      <HeroMediaSlider slide={activeSlide} />
      <HeroContentSlider slide={activeSlide} />
    </>
  );
}
