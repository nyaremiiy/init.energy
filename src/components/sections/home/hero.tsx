import { Container } from "@/components/layout/container";
import { Label } from "@/components/ui/label";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <picture className="hero__media">
        <source
          media="(max-width: 767px)"
          srcSet="/images/home/hero/w750.avif"
          type="image/avif"
        />
        <source
          media="(max-width: 1279px)"
          srcSet="/images/home/hero/w1280.avif"
          type="image/avif"
        />
        <source
          media="(max-width: 1919px)"
          srcSet="/images/home/hero/w1920.avif"
          type="image/avif"
        />
        <source srcSet="/images/home/hero/w2560.avif" type="image/avif" />
        {/* The local responsive sources are already optimized for this hero. */}
        <img
          src="/images/home/hero/w2560.webp"
          alt=""
          aria-hidden="true"
          className="hero__image"
        />
      </picture>
      <div className="absolute inset-0 z-10 flex items-center">
        <Container className="flex flex-col items-start gap-4">
          <Label>Твоя енергетична незалежність</Label>
          <h1
            id="hero-title"
            className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Комплексні енергетичні рішення
          </h1>
        </Container>
      </div>
    </section>
  );
}
