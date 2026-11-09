import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { CardLabel } from "./card-label";
import { Heading } from "./heading";
import { IconButton } from "./icon-button";
import { MediaPlaceholder } from "./media-placeholder";

type ProductCardProps = {
  name: string;
  href: string;
  segment: string;
  segmentIcon: LucideIcon;
  description: string;
  specs: Array<{ label: string; value: string }>;
  image?: { src: string; alt: string; width: number; height: number };
  linkLabel: string;
  specsLabel: string;
  photoPendingCaption: string;
};

export function ProductCard({
  name,
  href,
  segment,
  segmentIcon,
  description,
  specs,
  image,
  linkLabel,
  specsLabel,
  photoPendingCaption,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col gap-6 rounded-3xl bg-surface p-2 text-ink shadow-card transition duration-300 hover:bg-ink hover:text-white motion-safe:hover:-translate-y-1">
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          // Card media width: ~380px in the 3-col grid, half / 5/6 of the viewport below lg.
          sizes="(min-width: 1440px) 380px, (min-width: 1024px) 26vw, (min-width: 768px) 45vw, 80vw"
          className="aspect-4/3 w-full rounded-2xl object-cover"
        />
      ) : (
        <MediaPlaceholder caption={photoPendingCaption} />
      )}

      <div className="flex flex-1 flex-col gap-6 px-4 pb-4 lg:px-6 lg:pb-6">
        <div className="flex flex-col gap-4">
          <CardLabel tone="light" hoverInverse icon={segmentIcon}>
            {segment}
          </CardLabel>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Heading
                as="h3"
                size="h3"
                className="text-ink group-hover:text-white"
              >
                {name}
              </Heading>
              <p className="text-base leading-relaxed text-ink/70 group-hover:text-white/75">
                {description}
              </p>
            </div>
            <IconButton
              href={href}
              aria-label={linkLabel}
              variant="outline-light"
              className="group-hover:!border-white/60"
            />
          </div>
        </div>

        <dl
          aria-label={specsLabel}
          className="mt-auto divide-y divide-line border-t border-line group-hover:divide-white/16 group-hover:border-white/16"
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-baseline justify-between gap-4 py-3 text-base"
            >
              <dt className="text-ink/70 group-hover:text-white/75">
                {spec.label}
              </dt>
              <dd className="text-right font-medium tabular-nums">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
