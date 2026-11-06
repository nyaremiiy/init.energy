import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Heading } from "./heading";
import { Label } from "./label";
import { MediaPlaceholder } from "./media-placeholder";

type ProductCardTone = "light" | "dark";

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
  tone?: ProductCardTone;
};

const toneClasses: Record<
  ProductCardTone,
  {
    card: string;
    title: string;
    muted: string;
    value: string;
    divider: string;
    link: string;
  }
> = {
  light: {
    card: "bg-surface text-ink",
    title: "text-ink",
    muted: "text-ink/70",
    value: "text-ink",
    divider: "divide-line border-line",
    link: "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-ink",
  },
  dark: {
    card: "bg-ink text-white",
    title: "text-white",
    muted: "text-white/75",
    value: "text-white",
    divider: "divide-white/16 border-white/16",
    link: "border-white/40 text-white hover:border-white hover:bg-white hover:text-ink focus-visible:outline-white",
  },
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
  tone = "light",
}: ProductCardProps) {
  const classes = toneClasses[tone];

  return (
    <article
      className={`flex h-full flex-col gap-6 rounded-3xl p-6 transition duration-300 motion-safe:hover:-translate-y-1 lg:p-8 ${classes.card}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          // Matches the real card media width: 3 / 2 / 1 cards per row minus gutters and padding.
          sizes="(min-width: 1440px) 373px, (min-width: 1024px) calc((100vw - 80px) / 3 - 80px), (min-width: 768px) calc((100vw - 64px) / 2 - 64px), calc(100vw - 88px)"
          className="aspect-4/3 w-full rounded-2xl object-cover"
        />
      ) : (
        <MediaPlaceholder caption={photoPendingCaption} tone={tone} />
      )}

      <div className="flex flex-col gap-4">
        <Label tone={tone === "light" ? "onLight" : "onDark"}>{segment}</Label>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Heading as="h3" className={`text-2xl ${classes.title}`}>
              {name}
            </Heading>
            <p className={`text-base leading-relaxed ${classes.muted}`}>
              {description}
            </p>
          </div>
          <Link
            href={href}
            aria-label={linkLabel}
            className={`group inline-flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${classes.link}`}
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
        className={`mt-auto divide-y border-t ${classes.divider}`}
      >
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 py-3 text-sm"
          >
            <dt className={classes.muted}>{spec.label}</dt>
            <dd
              className={`text-right font-medium tabular-nums ${classes.value}`}
            >
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
