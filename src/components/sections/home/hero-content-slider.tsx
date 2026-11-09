"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
import { Eyebrow } from "@/components/ui/eyebrow";

import type { HeroSlide } from "./hero-slides";

type HeroContentSliderProps = {
  slide: HeroSlide;
};

export function HeroContentSlider({ slide }: HeroContentSliderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-10 flex items-center overflow-hidden pt-28 pb-24 lg:pt-32 lg:pb-0">
      <Container>
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
              className="flex flex-col items-start gap-5"
            >
              <Eyebrow tone="dark">{slide.label}</Eyebrow>
              <Heading
                as={slide.headingLevel}
                id={slide.id}
                letterSpacing="normal"
                lineHeight="compact"
                className="max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
              >
                {slide.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </Heading>
              <Description size="compactMobile" className="mt-2 max-w-2xl">
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
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
