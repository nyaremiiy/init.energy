import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CardLabel } from "./card-label";
import { Heading } from "./heading";

type SegmentCardTone = "light" | "navy" | "dark";

type SegmentCardProps = {
  index: string;
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
    link: string;
    /** First link of the card: filled light pill. */
    featuredLink: string;
    featuredMuted: string;
  }
> = {
  light: {
    card: "bg-white text-ink hover:bg-navy hover:text-white",
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
}: SegmentCardProps) {
  const classes = toneClasses[tone];

  return (
    <article
      className={`group flex h-full flex-col gap-6 rounded-3xl shadow-card p-6 transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-8 ${classes.card}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className={`font-heading text-number-sm font-light tabular-nums lg:text-number ${classes.index}`}
        >
          {index}
        </span>
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

      <nav aria-label={navLabel} className="mt-auto">
        <ul className="flex flex-col gap-2">
          {links.map((link, linkIndex) => {
            const featured = linkIndex === 0;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-full border px-5 py-3 text-base font-medium transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${featured ? classes.featuredLink : classes.link}`}
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
    </article>
  );
}
