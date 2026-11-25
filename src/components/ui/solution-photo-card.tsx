import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "./arrow-link";
import { Button } from "./button";
import { CardLabel } from "./card-label";
import { Heading } from "./heading";

type SolutionPhotoCardProps = {
  index: string;
  segment: string;
  segmentIcon: LucideIcon;
  image: { src: string; alt: string };
  capacity: { value: string; unit: string };
  capacityLabel: string;
  title: string;
  description: string;
  loads: Array<{ icon: LucideIcon; label: string }>;
  recommendLabel: string;
  links: Array<{ label: string; spec?: string; href: string }>;
  navLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

/* Open state: hover or keyboard focus inside the card. */
const open = "can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100";

/**
 * Home «Що вам потрібно живити?» card: photo on the whole card under a scrim.
 * On a desktop with a mouse (`can-hover`) the recommended products and the
 * white button open on hover / focus; on touch screens they are always shown.
 * Pure CSS (Server Component).
 */
export function SolutionPhotoCard({
  index,
  segment,
  segmentIcon,
  image,
  capacity,
  capacityLabel,
  title,
  description,
  loads,
  recommendLabel,
  links,
  navLabel,
  ctaLabel,
  ctaHref,
}: SolutionPhotoCardProps) {
  return (
    <article className="group relative isolate flex h-full min-h-140 flex-col overflow-clip rounded-card p-card-sm text-white lg:p-card can-hover:min-h-192">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="-z-10 object-cover transition-transform duration-700 ease-tech motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 scrim-solution" />
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 scrim-solution-active transition-opacity duration-500 ease-tech motion-reduce:transition-none can-hover:opacity-0 ${open}`}
      />

      <div className="flex items-start justify-between gap-4">
        <CardLabel tone="dark" icon={segmentIcon}>
          {segment}
        </CardLabel>
        <span aria-hidden className="font-mono text-eyebrow-sm text-muted-dark tabular-nums sm:text-eyebrow">
          {index}
        </span>
      </div>

      <div className="mt-auto flex flex-col pt-8">
        <p className="flex flex-wrap items-baseline gap-x-2 whitespace-nowrap">
          <span className="font-heading text-number-sm font-light tracking-tight lg:text-number">
            {capacity.value}
          </span>
          <span className="font-heading text-lead font-light sm:text-h3-sm">{capacity.unit}</span>
        </p>
        <p className="mt-1 text-small text-muted-dark">{capacityLabel}</p>

        <Heading as="h3" size="h3" className="mt-5 text-white">
          {title}
        </Heading>
        <p className="mt-2 text-body leading-relaxed text-muted-dark">{description}</p>

        <div className="@container mt-5">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-4 @2xs:flex @2xs:justify-between @2xs:gap-1">
            {loads.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line-dark bg-fill-dark backdrop-blur-sm">
                  <Icon aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <span className="text-small leading-tight whitespace-nowrap text-muted-dark">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resting state on a desktop with a mouse: a duplicate of the button below, so it is
            hidden from keyboard and screen readers; focus goes straight to the product links. */}
        <div aria-hidden className="mt-6 hidden can-hover:block can-hover:group-hover:hidden can-hover:group-focus-within:hidden">
          <ArrowLink href={ctaHref} tone="dark" tabIndex={-1}>
            {ctaLabel}
          </ArrowLink>
        </div>

        {/* Recommendations: always shown on touch screens; open on hover / focus with a mouse. */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-tech motion-reduce:transition-none can-hover:grid-rows-[0fr] can-hover:group-hover:grid-rows-[1fr] can-hover:group-focus-within:grid-rows-[1fr]">
          <div
            className={`min-h-0 overflow-clip transition-opacity duration-500 ease-tech motion-reduce:transition-none can-hover:opacity-0 ${open} can-hover:group-hover:overflow-visible can-hover:group-focus-within:overflow-visible`}
          >
            <div className="flex flex-col pt-6">
              <p className="border-b border-line-dark pb-3 font-heading text-eyebrow-sm font-medium tracking-eyebrow text-muted-dark uppercase sm:text-eyebrow">
                {recommendLabel}
              </p>
              <nav aria-label={navLabel}>
                <ul>
                  {links.map((link) => (
                    <li key={link.href} className="border-b border-line-dark">
                      <Link
                        href={link.href}
                        className="group/row flex min-h-11 min-w-0 items-center gap-2 py-3 text-body font-semibold transition-colors duration-200 ease-tech focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <span className="min-w-0 flex-1 leading-tight">{link.label}</span>
                        {link.spec ? (
                          <span className="shrink-0 text-small font-normal whitespace-nowrap text-muted-dark tabular-nums transition-colors duration-200 group-hover/row:text-white">
                            {link.spec}
                          </span>
                        ) : null}
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 shrink-0 transition-transform duration-200 motion-safe:group-hover/row:translate-x-0.5 motion-safe:group-hover/row:-translate-y-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button
                href={ctaHref}
                variant="primary"
                fullWidth
                className="mt-5"
                icon={<ArrowUpRight aria-hidden className="size-4.5" />}
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
