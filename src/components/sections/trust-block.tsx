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
      <div className="relative">
        <Container
          inPanel
          className="flex flex-col gap-section-head-sm lg:gap-section-head py-panel-y-sm lg:py-panel-y"
        >
          <Reveal>
            <SectionHeader
              tone="dark"
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
          </Reveal>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.id}
                delay={index * 0.08}
                distance={16}
                className="flex flex-col-reverse justify-end gap-3 border-t border-white/16 pt-6"
              >
                <dt className="text-base text-white/75">{stat.label}</dt>
                <dd className="font-heading text-number-sm font-light whitespace-nowrap tabular-nums lg:text-number">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>

          <ol className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.id} className="flex flex-col gap-3">
                <Reveal
                  delay={index * 0.08}
                  distance={16}
                  className="flex h-full flex-col gap-3"
                >
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
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>

        <Reveal distance={12} duration={0.8}>
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
      </div>
    </Panel>
  );
}
