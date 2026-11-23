"use client";

import { useEffect, useReducer, useState } from "react";
import { useReducedMotion } from "motion/react";

import { HeroContentSlider } from "./hero-content-slider";
import { HeroMediaSlider } from "./hero-media-slider";
import { HeroSliderControls } from "./hero-slider-controls";

import type { HeroSlide } from "./hero-slides";
import {
  heroMediaTransitionDuration,
  heroSlideInterval,
} from "./hero-slider.constants";

type SliderState = {
  activeIndex: number;
  previousIndex: number | null;
  /** Bumps on every slide change or restart: re-keys the progress animation. */
  cycle: number;
};

type SliderAction =
  | { type: "next"; count: number }
  | { type: "go"; index: number }
  | { type: "clearPrevious" };

function sliderReducer(state: SliderState, action: SliderAction): SliderState {
  if (action.type === "clearPrevious") {
    return { ...state, previousIndex: null };
  }

  const index = action.type === "go" ? action.index : (state.activeIndex + 1) % action.count;
  if (index === state.activeIndex) return { ...state, cycle: state.cycle + 1 };

  return {
    activeIndex: index,
    previousIndex: state.activeIndex,
    cycle: state.cycle + 1,
  };
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [{ activeIndex, previousIndex, cycle }, dispatch] = useReducer(sliderReducer, {
    activeIndex: 0,
    previousIndex: null,
    cycle: 0,
  });
  const prefersReducedMotion = useReducedMotion();
  // Rotation pauses while the pointer or keyboard focus is on the text, while
  // the tab is hidden, and — until the visitor presses play — after the pause
  // button (WCAG 2.2.2). The end of the progress animation advances the slide.
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const paused = userPaused || hovered || focused || pageHidden;
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
      <HeroMediaSlider slide={activeSlide} previousSlide={crossfadeSlide} priority={activeIndex === 0} />
      <HeroContentSlider
        slide={activeSlide}
        onHoverChange={setHovered}
        onFocusChange={setFocused}
        controls={
          heroSlides.length > 1 ? (
            <HeroSliderControls
              slides={heroSlides}
              activeIndex={activeIndex}
              cycle={cycle}
              // Reduced motion: no rotation, so no fill and no pause button.
              autoplay={!prefersReducedMotion}
              paused={paused}
              userPaused={userPaused}
              durationMs={heroSlideInterval}
              onSelect={(index) => dispatch({ type: "go", index })}
              onComplete={() => dispatch({ type: "next", count: heroSlides.length })}
              onTogglePause={() => setUserPaused((value) => !value)}
            />
          ) : null
        }
      />
    </>
  );
}
