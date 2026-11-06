import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Heading } from "./heading";
import { Label } from "./label";
import { MediaPlaceholder } from "./media-placeholder";

type ProductCardProps = {
  name: string;
  href: string;
  segment: string;
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
  description,
  specs,
  image,
  linkLabel,
  specsLabel,
  photoPendingCaption,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-3xl bg-surface p-6 text-ink transition duration-300 motion-safe:hover:-translate-y-1 lg:p-8">
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

      <div className="flex flex-col gap-4">
        <Label tone="onLight">{segment}</Label>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Heading as="h3" className="text-2xl text-ink">
              {name}
            </Heading>
            <p className="text-base leading-relaxed text-ink/70">
              {description}
            </p>
          </div>
          <Link
            href={href}
            aria-label={linkLabel}
            className="group inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowUpRight
              aria-hidden
              className="size-5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      <dl
        aria-label={specsLabel}
        className="mt-auto divide-y divide-line border-t border-line"
      >
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 py-3 text-base"
          >
            <dt className="text-ink/70">{spec.label}</dt>
            <dd className="text-right font-medium tabular-nums">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
