import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Reveal } from "@/components/ui/reveal";

type TrustBlockProps = {
  /** Optional anchor id for the section (e.g. "about-us" on the home page). */
  id?: string;
  titleId: string;
  eyebrow: string;
  title: string;
  lead: string;
  link?: { href: string; label: string };
  stats: Array<{ id: string; value: string; label: string }>;
  arguments: Array<{ id: string; title: string; description: string }>;
  image?: { src: string; alt: string; width: number; height: number };
  photoPendingCaption: string;
};

/**
 * Dark trust panel: header, key numbers, three arguments and a wide photo.
 * Content comes from props so the block can be reused on service pages.
 */
export function TrustBlock({
  id,
  titleId,
  eyebrow,
  title,
  lead,
  link,
  stats,
  arguments: items,
  image,
  photoPendingCaption,
}: TrustBlockProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white px-2.5 pt-section-sm sm:px-4 lg:pt-section"
    >
      <Reveal className="overflow-hidden rounded-panel bg-ink text-white">
        <Container className="flex flex-col gap-section-head py-section-sm lg:py-section">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="flex flex-col items-start gap-5 lg:col-span-7">
              <Label tone="onDark">{eyebrow}</Label>
              <Heading
                as="h2"
                id={titleId}
                className="text-3xl text-white sm:text-4xl lg:text-5xl"
              >
                {title}
              </Heading>
            </div>
            <div className="flex flex-col items-start gap-5 lg:col-span-5">
              <p className="text-base leading-relaxed text-white/75 sm:text-lg">
                {lead}
              </p>
              {link ? (
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {link.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </Link>
              ) : null}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col-reverse justify-end gap-3 border-t border-white/16 pt-6"
              >
                <dt className="text-base text-white/75">{stat.label}</dt>
                <dd className="font-heading text-4xl leading-none font-light whitespace-nowrap tabular-nums sm:text-5xl lg:text-6xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <ol className="grid gap-10 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.id} className="flex flex-col gap-3">
                <span
                  aria-hidden
                  className="text-sm text-white/75 tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Heading as="h3" className="text-xl text-white">
                  {item.title}
                </Heading>
                <p className="text-base leading-relaxed text-white/75">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>

        <div className="relative">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="100vw"
              quality={90}
              className="aspect-4/3 w-full object-cover md:aspect-21/8"
            />
          ) : (
            <MediaPlaceholder
              caption={photoPendingCaption}
              tone="dark"
              className="aspect-4/3 w-full md:aspect-21/8"
            />
          )}
          {/* Fade the photo out of the dark panel. */}
          <div
            aria-hidden
            className="fade-from-ink pointer-events-none absolute inset-x-0 top-0 h-1/2"
          />
        </div>
      </Reveal>
    </section>
  );
}
