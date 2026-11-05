"use client";

import { useEffect, useReducer } from "react";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";

import { heroSlides } from "./hero-slides";

const slideInterval = 6000;
const transitionDuration = 300;

type SliderState = {
  activeIndex: number;
  previousIndex: number | null;
};

type SliderAction = { type: "next" } | { type: "clearPrevious" };

function sliderReducer(
  state: SliderState,
  action: SliderAction,
): SliderState {
  if (action.type === "clearPrevious") {
    return { ...state, previousIndex: null };
  }

  return {
    activeIndex: (state.activeIndex + 1) % heroSlides.length,
    previousIndex: state.activeIndex,
  };
}

export function HeroContentSlider() {
  const [{ activeIndex, previousIndex }, dispatch] = useReducer(sliderReducer, {
    activeIndex: 0,
    previousIndex: null,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(
      () => dispatch({ type: "next" }),
      slideInterval,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => dispatch({ type: "clearPrevious" }),
      transitionDuration,
    );

    return () => window.clearTimeout(timeoutId);
  }, [previousIndex]);

  return (
    <div className="absolute inset-0 z-10 flex items-center overflow-hidden">
      <Container>
        <div className="grid" aria-live="polite">
          {heroSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            const isPrevious = index === previousIndex;
            const motionClasses = isActive
              ? "translate-x-0 opacity-100"
              : isPrevious
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0";

            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`col-start-1 row-start-1 flex flex-col items-start gap-5 transition duration-300 ease-out motion-reduce:transition-none ${isActive ? "pointer-events-auto" : "pointer-events-none"} ${motionClasses}`}
              >
                <Label>{slide.label}</Label>
                <Heading
                  as={slide.headingLevel}
                  id={slide.id}
                  lineHeight="compact"
                  className="max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
                >
                  {slide.heading}
                </Heading>
                <Description className="mt-2 max-w-2xl">
                  {slide.description}
                </Description>
                <div className="flex flex-wrap gap-3 pt-4">
                  {slide.actions.map((action) => (
                    <Button
                      key={action.label}
                      href={action.href}
                      variant={action.variant}
                      icon={<ArrowUpRight aria-hidden className="size-4" />}
                      size="wide"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
