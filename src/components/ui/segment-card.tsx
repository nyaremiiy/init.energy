import type { LucideIcon } from "lucide-react";

import { CardLabel } from "./card-label";
import { Heading } from "./heading";
import { PillLink } from "./pill-link";

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
};

const toneClasses: Record<
  SegmentCardTone,
  {
    card: string;
    index: string;
    text: string;
    muted: string;
  }
> = {
  light: {
    card: "bg-sky text-ink hover:bg-navy hover:text-white",
    index: "text-ink group-hover:text-white",
    text: "text-ink group-hover:text-white",
    muted: "text-muted group-hover:text-muted-dark",
  },
  navy: {
    card: "bg-navy text-white hover:bg-ink",
    index: "text-white",
    text: "text-white",
    muted: "text-muted-dark",
  },
  dark: {
    card: "bg-ink text-white",
    index: "text-white",
    text: "text-white",
    muted: "text-muted-dark",
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
}: SegmentCardProps) {
  const classes = toneClasses[tone];

  return (
    <article
      className={`group flex h-full flex-col gap-6 rounded-card p-card-sm transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-card ${classes.card}`}
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
        <p className={`text-body leading-relaxed ${classes.muted}`}>
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

  return (
    <nav aria-label={navLabel} className="mt-auto">
      <ul className="flex flex-col gap-2">
        {links.map((link, linkIndex) => {
          const featured = linkIndex === 0;

          return (
            <li key={link.href}>
              <PillLink
                href={link.href}
                tone={tone === "light" ? "light" : "dark"}
                featured={featured}
                meta={link.spec}
              >
                {link.label}
              </PillLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
