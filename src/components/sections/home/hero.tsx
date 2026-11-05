import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
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
        <Container className="flex flex-col items-start gap-5">
          <Label>Твоя енергетична незалежність</Label>
          <Heading
            as="h1"
            id="hero-title"
            lineHeight="compact"
            className="max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
          >
            Комплексні енергетичні рішення
          </Heading>
          <Description className="mt-2 max-w-2xl">
            Проєктуємо та встановлюємо сонячні електростанції, панелі й
            системи резервного живлення — від інженерного рішення до запуску
            та сервісу.
          </Description>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              href="#contact"
              icon={<ArrowUpRight aria-hidden className="size-4" />}
            >
              Підібрати рішення
            </Button>
            <Button
              href="#solar-stations"
              variant="secondary"
              icon={<ArrowUpRight aria-hidden className="size-4" />}
            >
              Сонячні станції
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
