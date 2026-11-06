import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentCard } from "@/components/ui/segment-card";
import { TextLink } from "@/components/ui/text-link";
import { routes } from "@/content/routes";
import {
  getSolutionLinks,
  getSolutionProduct,
  solutions,
} from "@/content/solutions";
import { format, messages } from "@/lib/messages";

const titleId = "solutions-by-segment-title";

export function SolutionsBySegment() {
  const t = messages.solutionsBySegment;
  const hubs = [
    { ...t.hubs.ses, href: routes.services.turnkeySes },
    { ...t.hubs.products, href: routes.sections.products },
  ];

  return (
    <section
      aria-labelledby={titleId}
      className="-mt-12 bg-white pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <Container className="flex flex-col gap-10 lg:gap-14">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={
              <TextLink href={routes.sections.contacts}>
                {t.calculatorLink}
              </TextLink>
            }
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {solutions.map((solution, cardIndex) => (
              <Reveal
                key={solution.id}
                delay={cardIndex * 0.12}
                className="h-full"
              >
                <SegmentCard
                  index={solution.index}
                  segment={solution.segment}
                  title={solution.title}
                  description={solution.description}
                  product={getSolutionProduct(solution)}
                  productTerm={t.productTerm}
                  specTerm={t.capacityTerm}
                  links={getSolutionLinks(solution)}
                  navLabel={format(t.cardNavLabel, {
                    segment: solution.segment,
                  })}
                  tone={solution.tone}
                />
              </Reveal>
            ))}
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {hubs.map((hub, hubIndex) => (
              <li key={hub.href}>
                <Reveal delay={hubIndex * 0.12} className="h-full">
                  <Link
                    href={hub.href}
                    className="group flex h-full items-center justify-between gap-6 rounded-3xl bg-sky p-6 text-ink transition duration-300 motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:p-8"
                  >
                    <span className="flex flex-col items-start gap-3">
                      <Label tone="onLight">{hub.label}</Label>
                      <span className="font-heading text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
                        {hub.title}
                      </span>
                    </span>
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <ArrowUpRight
                        aria-hidden
                        className="size-5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
