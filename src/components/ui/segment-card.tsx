import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
  links: Array<{ label: string; href: string }>;
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
    link: string;
  }
> = {
  light: {
    card: "bg-surface text-ink",
    index: "text-ink",
    text: "text-ink",
    muted: "text-ink/70",
    productRow: "border border-line bg-white",
    link: "border-line focus-visible:outline-ink",
  },
  dark: {
    card: "bg-ink text-white",
    index: "text-white",
    text: "text-white",
    muted: "text-white/75",
    productRow: "bg-white/6 text-white",
    link: "border-white/16 focus-visible:outline-white",
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
      className={`flex h-full flex-col gap-6 rounded-3xl p-6 transition duration-300 motion-safe:hover:-translate-y-0.5 lg:p-8 ${classes.card}`}
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
        <Heading as="h3" weight="medium" className={`text-2xl ${classes.text}`}>
          {title}
        </Heading>
        <p className={`text-base leading-relaxed ${classes.muted}`}>
          {description}
        </p>
      </div>

      <dl
        className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl px-4 py-3 text-sm ${classes.productRow}`}
      >
        <div className="flex flex-col">
          <dt className="sr-only">{productTerm}</dt>
          <dd className="font-medium">{product.name}</dd>
        </div>
        <div className="flex flex-col">
          <dt className="sr-only">{specTerm}</dt>
          <dd className={`tabular-nums ${classes.muted}`}>{product.spec}</dd>
        </div>
      </dl>

      <nav aria-label={navLabel} className="mt-auto">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`group flex items-center justify-between gap-4 border-t py-4 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${classes.link}`}
              >
                {link.label}
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
