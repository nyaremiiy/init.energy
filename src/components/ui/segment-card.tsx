import { ArrowUpRight } from "lucide-react";

import { Button } from "./button";
import { Heading } from "./heading";
import { Label } from "./label";

type SegmentCardTone = "light" | "dark";

type SegmentCardProps = {
  index: string;
  segment: string;
  title: string;
  description: string;
  product: { name: string; spec: string };
  productTerm: string;
  specTerm: string;
  links: Array<{ label: string; title?: string; href: string }>;
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
    productRow: string;
    /** Outline button variant for card links. */
    link: "secondary" | "secondaryOnLight";
  }
> = {
  light: {
    card: "bg-surface text-ink",
    index: "text-ink",
    text: "text-ink",
    muted: "text-ink/70",
    productRow: "border border-line bg-white",
    link: "secondaryOnLight",
  },
  dark: {
    card: "bg-ink text-white",
    index: "text-white",
    text: "text-white",
    muted: "text-white/75",
    productRow: "bg-white/6 text-white",
    link: "secondary",
  },
};

export function SegmentCard({
  index,
  segment,
  title,
  description,
  product,
  productTerm,
  specTerm,
  links,
  navLabel,
  tone = "light",
}: SegmentCardProps) {
  const classes = toneClasses[tone];

  return (
    <article
      className={`flex h-full flex-col gap-6 rounded-3xl p-6 lg:p-8 ${classes.card}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className={`font-heading text-5xl leading-none font-light tabular-nums lg:text-6xl ${classes.index}`}
        >
          {index}
        </span>
        <Label tone={tone === "light" ? "onLight" : "onDark"}>{segment}</Label>
      </div>

      <div className="flex flex-col gap-3">
        <Heading as="h3" className={`text-2xl ${classes.text}`}>
          {title}
        </Heading>
        <p className={`text-base leading-relaxed ${classes.muted}`}>
          {description}
        </p>
      </div>

      <dl
        className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl px-5 py-3 sm:rounded-full text-sm ${classes.productRow}`}
      >
        <div>
          <dt className="sr-only">{productTerm}</dt>
          <dd className="font-semibold">{product.name}</dd>
        </div>
        <div>
          <dt className="sr-only">{specTerm}</dt>
          <dd className={`tabular-nums ${classes.muted}`}>{product.spec}</dd>
        </div>
      </dl>

      <nav aria-label={navLabel} className="mt-auto pt-2">
        <ul className="flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Button
                href={link.href}
                title={link.title}
                size="compact"
                variant={classes.link}
                icon={<ArrowUpRight aria-hidden className="size-4" />}
              >
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
