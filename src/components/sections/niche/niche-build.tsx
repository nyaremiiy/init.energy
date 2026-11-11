import { ChartColumn, PencilRuler, PlugZap, Wrench } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { StepMarker } from "@/components/ui/step-marker";
import { anchors } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

import { nicheIcons } from "./niche-ui";

const titleId = "niche-build-title";

/** One icon per build step: analysis, design, installation, commissioning. */
const stepIcons = [ChartColumn, PencilRuler, Wrench, PlugZap];

/** «What's in the plant and how we build it»: components, a photo slot (3:4) and the steps. */
export function NicheBuild({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const t = getMessages().nichePage;

  return (
    <section
      id={anchors.nicheBuild}
      aria-labelledby={titleId}
      className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="STEPS" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrows.build} title={page.build.title[locale]} titleId={titleId} lead={page.build.lead[locale]} />
        </Reveal>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <Reveal className="flex flex-col gap-4">
            <h3 className="font-heading text-h3-sm font-medium text-ink sm:text-h3">{t.componentsTitle}</h3>
            <ul className="border-b border-line">
              {page.build.components.map((item) => {
                const Icon = nicheIcons[item.icon];
                return (
                  <li key={item.label.en} className="flex items-center gap-3 border-t border-line py-3 text-base text-ink">
                    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
                      <Icon className="size-4.5" strokeWidth={1.7} />
                    </span>
                    {item.label[locale]}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="hidden md:block">
            {/* TODO(content): photo of a hotel rooftop plant (3:4). */}
            <MediaPlaceholder caption={page.build.mediaLabel[locale]} aspect="3/4" className="aspect-3/4 w-full rounded-3xl" />
          </Reveal>

          <Reveal delay={0.16} className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-h3-sm font-medium text-ink sm:text-h3">{t.stepsTitle}</h3>
            <ol className="flex flex-col gap-3">
              {page.build.steps.map((step, index) => (
                <li key={step.title.en} className="flex flex-col gap-3 rounded-3xl bg-surface p-card-sm">
                  <StepMarker index={index} icon={stepIcons[index] ?? Wrench} />
                  <p className="font-heading text-base font-semibold text-ink">{step.title[locale]}</p>
                  <p className="text-sm text-ink/70">{step.text[locale]}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
