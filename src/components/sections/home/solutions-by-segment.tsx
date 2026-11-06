import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconButton } from "@/components/ui/icon-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentCard } from "@/components/ui/segment-card";
import { anchors, routes } from "@/content/routes";
import { getSolutionLinks, solutions } from "@/content/solutions";
import { format, messages } from "@/lib/messages";

const titleId = "solutions-by-segment-title";

export function SolutionsBySegment() {
  const t = messages.solutionsBySegment;

  return (
    <section
      id={anchors.solutions}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={
              <ArrowLink href={routes.sections.contacts}>
                {t.calculatorLink}
              </ArrowLink>
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
                  links={getSolutionLinks(solution)}
                  navLabel={format(t.cardNavLabel, {
                    segment: solution.segment,
                  })}
                  tone={solution.tone}
                />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link
              href={routes.services.turnkeySes}
              className="group flex items-center justify-between gap-6 rounded-3xl bg-sky p-6 text-ink transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:hover:-translate-y-0.5 lg:p-8"
            >
              <span className="flex flex-col items-start gap-3">
                <Eyebrow tone="light">{t.hub.label}</Eyebrow>
                <span className="font-heading text-h3 font-semibold tracking-tight">
                  {t.hub.title}
                </span>
              </span>
              <IconButton decorative variant="outline-light" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
