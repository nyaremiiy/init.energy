import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/description";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";

export type HeroAction = {
  href: string;
  label: string;
  variant: "primary" | "secondary";
};

type HeroCopyProps = {
  id: string;
  eyebrow: string;
  /** Lines are shown as blocks; one space joins them in the text (SEO, screen readers). */
  lines: string[];
  headingLevel: "h1" | "h2";
  description: string;
  actions: HeroAction[];
  breadcrumbs?: { items: { name: string; href?: string }[]; label: string };
};

/**
 * Text block of the site hero: (breadcrumbs), eyebrow, heading, lead and
 * buttons. One markup for the home slider and for single-content pages.
 */
export function HeroCopy({ id, eyebrow, lines, headingLevel, description, actions, breadcrumbs }: HeroCopyProps) {
  return (
    <div className="flex flex-col items-start gap-5">
      {breadcrumbs ? (
        <div className="mb-2 opacity-90">
          <Breadcrumbs tone="dark" label={breadcrumbs.label} items={breadcrumbs.items} />
        </div>
      ) : null}
      <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      <Heading
        as={headingLevel}
        id={id}
        letterSpacing="normal"
        lineHeight="compact"
        className="max-w-3xl text-hero-sm text-white md:text-hero-md lg:text-hero"
      >
        {lines.map((line, index) => (
          <span key={line} className="block">
            {index > 0 ? " " : null}
            {line}
          </span>
        ))}
      </Heading>
      <Description size="compactMobile" className="mt-2 max-w-2xl">
        {description}
      </Description>
      <div className="flex flex-wrap gap-3 pt-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            href={action.href}
            variant={action.variant}
            icon={<ArrowUpRight aria-hidden className="size-4" />}
            size="wide"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
