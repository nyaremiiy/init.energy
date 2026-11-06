import { HeroSlider } from "./hero-slider";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroSlider />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-2 h-40 bg-linear-to-b from-[rgb(0_2_23/80%)] to-transparent lg:h-56"
      />
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
        <ScrollIndicator />
      </div>
    </section>
  );
}
