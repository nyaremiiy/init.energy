
import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { SegmentCard } from "@/components/ui/segment-card";
import { anchors, routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { segmentIcons } from "@/content/segments";
import {
  getSolutionCapacity,
  getSolutionLinks,
  solutions,
} from "@/content/solutions";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const titleId = "solutions-by-segment-title";

export function SolutionsBySegment() {
  const messages = getMessages();
  const locale = getLocale();
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
              <ArrowLink href={localizePath(routes.calculators.sesPayback, locale)}>
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
                  segment={solution.segment[locale]}
                  segmentIcon={segmentIcons[solution.segmentIcon]}
                  title={solution.title[locale]}
                  description={solution.description[locale]}
                  links={getSolutionLinks(solution, locale)}
                  navLabel={format(t.cardNavLabel, {
                    segment: solution.segment[locale],
                  })}
                  tone={solution.tone}
                  showcase={{
                    capacity: getSolutionCapacity(solution, locale),
                    capacityLabel: t.capacityLabels[solution.id],
                    recommendLabel: t.recommend,
                    ctaLabel: t.cardCtas[solution.id],
                    ctaHref: solution.ctaHref,
                  }}
                />
              </Reveal>
            ))}
          </div>

        </div>

        <Reveal delay={0.08} distance={12}>
          <p className="hidden flex-wrap items-center justify-center sm:flex gap-x-3 gap-y-2 font-heading text-eyebrow font-medium tracking-eyebrow text-muted uppercase">
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
        </Reveal>
      </Container>
    </section>
  );
}
