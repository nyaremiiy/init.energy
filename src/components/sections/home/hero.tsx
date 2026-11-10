import { Panel } from "@/components/ui/panel";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { getLocale } from "@/i18n/server";

import { getHeroSlides, type HeroSlide } from "./hero-slides";
import { HeroSlider } from "./hero-slider";

export function Hero({ slides }: { slides?: HeroSlide[] } = {}) {
  const list = slides ?? getHeroSlides(getLocale());
  return (
    <Panel
      as="section"
      variant="dark"
      aria-labelledby="hero-title"
      className="bg-white pt-panel-sm sm:pt-panel"
      panelClassName="hero shadow-soft"
    >
      <HeroSlider slides={list} />
      {/* Darken the top so the transparent header stays readable. */}
      <div
        aria-hidden
        className="fade-from-ink pointer-events-none absolute inset-x-0 top-0 z-2 h-40 opacity-80 lg:h-56"
      />
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
        <ScrollIndicator />
      </div>
    </Panel>
  );
}
