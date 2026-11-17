import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "./button";
import { Description } from "./description";
import { MediaPlaceholder } from "./media-placeholder";

type PromoBannerTone = "light" | "dark";

type PromoBannerProps = {
  title: string;
  description: string;
  cta: { label: string; href: string };
  /** Photo on the right (desktop) / on top (mobile). */
  image?: { src: string; alt: string };
  /** Caption for a dashed placeholder while there is no photo. */
  placeholder?: string;
  tone?: PromoBannerTone;
};

const tones: Record<PromoBannerTone, { panel: string; text: string; description: "onLight" | "onDark"; button: "dark" | "primary" }> = {
  light: { panel: "bg-sky", text: "text-ink", description: "onLight", button: "dark" },
  dark: { panel: "bg-ink-glow-start", text: "text-white", description: "onDark", button: "primary" },
};

/**
 * Promo banner: text on the left, a photo on the right with a curved edge
 * (CSS mask in globals.css). Mobile: photo on top with a curved bottom, then text.
 * Only the button is a link. The title is a <p>, so the page outline is unchanged.
 */
export function PromoBanner({ title, description, cta, image, placeholder, tone = "dark" }: PromoBannerProps) {
  const t = tones[tone];

  return (
    <div className={`relative flex flex-col overflow-clip rounded-panel-sm lg:block lg:min-h-80 lg:rounded-panel ${t.panel}`}>
      {/* Photo layer: 200 px on top (mobile); full-bleed layer masked into a curve (lg). */}
      <div className="relative h-50 mask-promo-curve-bottom lg:absolute lg:inset-0 lg:h-auto lg:mask-promo-curve">
        <div className="absolute inset-0 lg:left-auto lg:w-7/12">
          {image ? (
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" quality={90} className="object-cover object-promo" />
          ) : (
            <MediaPlaceholder caption={placeholder ?? ""} tone={tone} fill />
          )}
        </div>
      </div>

      <div className={`relative flex flex-col items-start gap-4 px-card-sm pb-card-sm lg:min-h-80 lg:w-11/24 lg:justify-center lg:py-card lg:pr-0 lg:pl-card ${t.text}`}>
        <p className="font-heading text-h3 font-semibold tracking-tight lg:text-h2-md">{title}</p>
        <Description tone={t.description}>{description}</Description>
        <Button
          href={cta.href}
          variant={t.button}
          className="mt-2 w-full lg:w-auto"
          icon={<ArrowUpRight aria-hidden className="size-4.5" />}
        >
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
