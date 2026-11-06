import { HeroSlider } from "./hero-slider";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroSlider />
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
        <ScrollIndicator />
      </div>
    </section>
  );
}
