import Image from "next/image";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

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
    <Panel
      as="section"
      variant="dark"
      panelClassName="bg-ink-glow"
      id={id}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="ENERGY" tone="dark" align="upper" />
      <Reveal className="relative">
        <Container className="flex flex-col gap-section-head py-section-sm lg:py-section">
          <SectionHeader
            tone="dark"
            layout="split"
            eyebrow={eyebrow}
            title={title}
            titleId={titleId}
            lead={lead}
            aside={
              link ? (
                <ArrowLink href={link.href} tone="dark">
                  {link.label}
                </ArrowLink>
              ) : undefined
            }
          />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col-reverse justify-end gap-3 border-t border-white/16 pt-6"
              >
                <dt className="text-base text-white/75">{stat.label}</dt>
                <dd className="font-heading text-number-sm font-light whitespace-nowrap tabular-nums lg:text-number">
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
                <Heading as="h3" size="h3" className="text-white">
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
            className="fade-from-ink pointer-events-none absolute inset-x-0 top-0 h-3/4"
          />
        </div>
      </Reveal>
    </Panel>
  );
}
