import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import { CardLabel } from "./card-label";
import { Heading } from "./heading";

type SegmentCardTone = "light" | "navy" | "dark";

type SegmentCardProps = {
  /** Big «01» in the corner; omitted on cards without an order. */
  index?: string;
  segment: string;
  segmentIcon: LucideIcon;
  title: string;
  description: string;
  links: Array<{ label: string; spec?: string; href: string }>;
  navLabel: string;
  tone?: SegmentCardTone;
  showcase?: {
    capacity: string;
    capacityLabel: string;
    recommendLabel: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

const toneClasses: Record<
  SegmentCardTone,
  {
    card: string;
    index: string;
    text: string;
    muted: string;
    link: string;
    /** First link of the card: filled light pill. */
    featuredLink: string;
    featuredMuted: string;
  }
> = {
  light: {
    card: "bg-sky text-ink hover:bg-navy hover:text-white",
    index: "text-ink group-hover:text-white",
    text: "text-ink group-hover:text-white",
    muted: "text-ink/70 group-hover:text-white/75",
    link: "border-ink/20 group-hover:border-white/25 focus-visible:outline-ink",
    featuredLink: "border-ink/20 bg-white text-ink hover:border-ink",
    featuredMuted: "text-ink/70",
  },
  navy: {
    card: "bg-navy text-white hover:bg-ink",
    index: "text-white",
    text: "text-white",
    muted: "text-white/75",
    link: "border-white/25 focus-visible:outline-white",
    featuredLink: "border-white bg-white text-ink hover:bg-white/90",
    featuredMuted: "text-ink/70",
  },
  dark: {
    card: "bg-ink text-white",
    index: "text-white",
    text: "text-white",
    muted: "text-white/75",
    link: "border-white/25 focus-visible:outline-white",
    featuredLink: "border-white bg-white text-ink hover:bg-white/90",
    featuredMuted: "text-ink/70",
  },
};

export function SegmentCard({
  index,
  segment,
  segmentIcon,
  title,
  description,
  links,
  navLabel,
  tone = "light",
  showcase,
}: SegmentCardProps) {
  const classes = toneClasses[tone];

  if (showcase) {
    const isLight = tone === "light";
    const muted = isLight ? "text-ink/70" : "text-white/75";
    const divider = isLight ? "border-line" : "border-white/25";
    const focus = isLight
      ? "focus-visible:outline-ink"
      : "focus-visible:outline-white";

    return (
      <article
        className={`flex h-full min-w-0 flex-col rounded-3xl p-card-sm lg:p-card ${isLight ? "bg-sky text-ink" : tone === "navy" ? "bg-navy text-white" : "bg-ink text-white"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <CardLabel tone={isLight ? "light" : "dark"} icon={segmentIcon}>
            {segment}
          </CardLabel>
          {index ? (
            <span
              aria-hidden
              className={`font-heading text-eyebrow font-light tabular-nums ${muted}`}
            >
              {index}
            </span>
          ) : null}
        </div>

        <div className="mt-8 min-w-0">
          <p className="font-heading text-number-sm font-light tracking-tight whitespace-nowrap 2xl:text-number">
            {showcase.capacity}
          </p>
          <p className={`mt-2 text-small ${muted}`}>{showcase.capacityLabel}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Heading as="h3" size="h3" weight="semibold">
            {title}
          </Heading>
          <p className={`text-base leading-relaxed ${muted}`}>{description}</p>
        </div>

        <div className="mt-auto pt-10">
          <p
            className={`mb-3 font-heading text-eyebrow-sm font-medium tracking-eyebrow uppercase sm:text-eyebrow ${muted}`}
          >
            {showcase.recommendLabel}
          </p>
          <nav aria-label={navLabel}>
            <ul className={`border-b ${divider}`}>
              {links.map((link) => (
                <li key={link.href} className={`border-t ${divider}`}>
                  <Link
                    href={link.href}
                    className={`group flex min-w-0 items-center gap-2 py-3 text-base font-medium transition-colors duration-200 ease-tech focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${focus}`}
                  >
                    <span className="min-w-0 flex-1 leading-tight">
                      {link.label}
                    </span>
                    {link.spec ? (
                      <span
                        className={`shrink-0 text-small whitespace-nowrap tabular-nums ${muted}`}
                      >
                        {link.spec}
                      </span>
                    ) : null}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4.5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            href={showcase.ctaHref}
            variant={isLight ? "outline-light" : "secondary"}
            className="mt-6 w-full"
            icon={<ArrowUpRight aria-hidden className="size-4.5" />}
          >
            {showcase.ctaLabel}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group flex h-full flex-col gap-6 rounded-3xl p-card-sm transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-card ${classes.card}`}
    >
      <div className="flex items-start justify-between gap-4">
        {index ? (
          <span
            aria-hidden
            className={`font-heading text-number-sm font-light tabular-nums lg:text-number ${classes.index}`}
          >
            {index}
          </span>
        ) : null}
        <CardLabel
          tone={tone === "light" ? "light" : "dark"}
          hoverInverse={tone === "light"}
          icon={segmentIcon}
        >
          {segment}
        </CardLabel>
      </div>

      <div className="flex flex-col gap-3">
        <Heading as="h3" size="h3" className={classes.text}>
          {title}
        </Heading>
        <p className={`text-base leading-relaxed ${classes.muted}`}>
          {description}
        </p>
      </div>

      <SegmentLinks links={links} navLabel={navLabel} tone={tone} />
    </article>
  );
}

/**
 * Pill links at the bottom of a segment card: the first one is a filled
 * light pill, the rest are outlined. Also used by cards that are not
 * SegmentCards (sector cards on product pages) so the links look the same.
 */
export function SegmentLinks({
  links,
  navLabel,
  tone = "light",
}: {
  links: SegmentCardProps["links"];
  navLabel: string;
  tone?: SegmentCardTone;
}) {
  const classes = toneClasses[tone];

  return (
    <nav aria-label={navLabel} className="mt-auto">
      <ul className="flex flex-col gap-2">
        {links.map((link, linkIndex) => {
          const featured = linkIndex === 0;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`group flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-medium sm:px-5 sm:text-base transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${featured ? classes.featuredLink : classes.link}`}
              >
                <span className="flex-1">{link.label}</span>
                {link.spec ? (
                  <span
                    className={`text-right whitespace-nowrap tabular-nums ${featured ? classes.featuredMuted : classes.muted}`}
                  >
                    {link.spec}
                  </span>
                ) : null}
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
