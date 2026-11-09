import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { CardLabel } from "@/components/ui/card-label";
import { IconButton } from "@/components/ui/icon-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { SegmentCard } from "@/components/ui/segment-card";
import { anchors, routes } from "@/content/routes";
import { segmentIcons } from "@/content/segments";
import { getSolutionLinks, solutions } from "@/content/solutions";
import { format, messages } from "@/lib/messages";

const titleId = "solutions-by-segment-title";

export function SolutionsBySegment() {
  const t = messages.solutionsBySegment;

  return (
    <section
      id={anchors.solutions}
      aria-labelledby={titleId}
      className="relative scroll-mt-24 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="SOLAR" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {solutions.map((solution, cardIndex) => (
              <Reveal
                key={solution.id}
                delay={cardIndex * 0.12}
                className="h-full"
              >
                <SegmentCard
                  index={solution.index}
                  segment={solution.segment}
                  segmentIcon={segmentIcons[solution.segmentIcon]}
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
              className="group flex items-center justify-between gap-6 rounded-3xl shadow-card bg-surface p-card-sm text-ink transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:hover:-translate-y-0.5 lg:p-card"
            >
              <span className="flex flex-col items-start gap-3">
                <CardLabel icon={segmentIcons.solar}>{t.hub.label}</CardLabel>
                <span className="font-heading text-h3-sm font-semibold tracking-tight sm:text-h3">
                  {t.hub.title}
                </span>
              </span>
              <IconButton decorative variant="outline-light" />
            </Link>
          </Reveal>
        </div>

        <p className="hidden flex-wrap items-center justify-center sm:flex gap-x-3 gap-y-2 font-heading text-eyebrow font-medium tracking-eyebrow text-ink/80 uppercase">
          {t.keywords.map((keyword, index) => (
            <span key={keyword} className="inline-flex items-center gap-3">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full bg-current"
                />
              ) : null}
              {keyword}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
