"use client";

import { IconButton } from "@/components/ui/icon-button";
import { ProgressBarButton } from "@/components/ui/progress-bar-button";
import { useMessages } from "@/i18n/client";
import { format } from "@/lib/messages";

import type { HeroSlide } from "./hero-slides";

type HeroSliderControlsProps = {
  slides: HeroSlide[];
  activeIndex: number;
  cycle: number;
  /** False under prefers-reduced-motion: manual switching only, no fill, no pause button. */
  autoplay: boolean;
  /** Any pause (button, hover, focus, hidden tab): stops the fill. */
  paused: boolean;
  /** Pause set by the visitor with the button. */
  userPaused: boolean;
  durationMs: number;
  onSelect: (index: number) => void;
  onComplete: () => void;
  onTogglePause: () => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Counter «01 / 03», one progress bar per slide (each is a button) and the
 * pause / play button. Rendered on the server with the hero: no layout shift.
 * Nothing here is a live region: rotation is never announced.
 */
export function HeroSliderControls({ slides, activeIndex, cycle, autoplay, paused, userPaused, durationMs, onSelect, onComplete, onTogglePause }: HeroSliderControlsProps) {
  const t = useMessages().hero.controls;
  const total = slides.length;

  return (
    <div role="group" aria-label={t.label} className="flex items-center gap-4">
      <p className="font-heading text-small font-medium text-white tabular-nums">
        <span aria-hidden>
          {pad(activeIndex + 1)}
          <span className="text-muted-dark"> / {pad(total)}</span>
        </span>
        <span className="sr-only">{format(t.position, { current: String(activeIndex + 1), total: String(total) })}</span>
      </p>
      <div className="flex items-center gap-1.5">
        {slides.map((slide, index) => (
          <ProgressBarButton
            key={slide.id}
            label={format(t.goTo, { index: String(index + 1), title: slide.heading.join(" ") })}
            state={index === activeIndex ? "active" : index < activeIndex ? "done" : "upcoming"}
            durationMs={autoplay ? durationMs : undefined}
            running={!paused}
            cycle={cycle}
            onSelect={() => onSelect(index)}
            onComplete={onComplete}
          />
        ))}
      </div>
      {autoplay ? (
        <IconButton
          variant="outline-dark"
          size="sm"
          icon={userPaused ? "play" : "pause"}
          aria-label={userPaused ? t.play : t.pause}
          onClick={onTogglePause}
        />
      ) : null}
    </div>
  );
}
