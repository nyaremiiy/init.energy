import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <main>
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
        <Container className="relative z-10">
          <h1 id="hero-title" className="sr-only">
            init.energy
          </h1>
        </Container>
      </section>
    </main>
  );
}
