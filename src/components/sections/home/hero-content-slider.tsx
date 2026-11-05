"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";

import { heroSlides } from "./hero-slides";

const slideInterval = 6000;

export function HeroContentSlider() {
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
    <div className="absolute inset-0 z-10 flex items-center overflow-hidden">
      <Container>
        <div className="relative" aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={activeSlide.id}
              initial={
                prefersReducedMotion ? false : { opacity: 0, x: "100vw" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "-100vw" }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: "easeOut",
              }}
              className="flex flex-col items-start gap-5"
            >
              <Label>{activeSlide.label}</Label>
              <Heading
                as={activeSlide.headingLevel}
                id={activeSlide.id}
                letterSpacing="normal"
                lineHeight="compact"
                className="max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
              >
                {activeSlide.heading}
              </Heading>
              <Description className="mt-2 max-w-2xl">
                {activeSlide.description}
              </Description>
              <div className="flex flex-wrap gap-3 pt-4">
                {activeSlide.actions.map((action) => (
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
