"use client";

import { useEffect, useReducer, useState } from "react";
import { useReducedMotion } from "motion/react";

import { HeroContentSlider } from "./hero-content-slider";
import { HeroMediaSlider } from "./hero-media-slider";

import type { HeroSlide } from "./hero-slides";
import {
  heroMediaTransitionDuration,
  heroSlideInterval,
} from "./hero-slider.constants";

type SliderState = {
  activeIndex: number;
  previousIndex: number | null;
};

type SliderAction =
  | { type: "next"; count: number }
  | { type: "clearPrevious" };

function sliderReducer(state: SliderState, action: SliderAction): SliderState {
  if (action.type === "clearPrevious") {
    return { ...state, previousIndex: null };
  }

  return {
    activeIndex: (state.activeIndex + 1) % action.count,
    previousIndex: state.activeIndex,
  };
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [{ activeIndex, previousIndex }, dispatch] = useReducer(sliderReducer, {
    activeIndex: 0,
    previousIndex: null,
  });
  const prefersReducedMotion = useReducedMotion();
  // Rotation pauses while the pointer or keyboard focus is on the text and
  // while the tab is hidden, so nobody loses the slide they are reading.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const paused = hovered || focused || pageHidden;
  const heroSlides = slides;
  const activeSlide = heroSlides[activeIndex];
  const previousSlide =
    previousIndex === null ? undefined : heroSlides[previousIndex];
  const crossfadeSlide =
    previousSlide?.image.desktop === activeSlide.image.desktop
      ? undefined
      : previousSlide;

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || paused) {
      return;
    }

    const intervalId = window.setInterval(
      () => dispatch({ type: "next", count: slides.length }),
      heroSlideInterval,
    );

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, paused, slides.length]);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => dispatch({ type: "clearPrevious" }),
      heroMediaTransitionDuration * 1000,
    );

    return () => window.clearTimeout(timeoutId);
  }, [previousIndex]);

  return (
    <>
      <HeroMediaSlider slide={activeSlide} previousSlide={crossfadeSlide} />
      <HeroContentSlider
        slide={activeSlide}
        onHoverChange={setHovered}
        onFocusChange={setFocused}
      />
    </>
  );
}
