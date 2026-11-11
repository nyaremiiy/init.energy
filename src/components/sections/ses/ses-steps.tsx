import { Calculator, PencilRuler, ReceiptText, ShieldCheck, Wrench } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StepMarker } from "@/components/ui/step-marker";
import { anchors } from "@/content/routes";
import { buildSteps } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "ses-steps-title";

/** One icon per stage, in the order of `buildSteps`. */
const stepIcons = [Calculator, PencilRuler, ReceiptText, Wrench, ShieldCheck];

/** How we build a plant: five ordered stages. Durations are TODO(content). */
export function SesSteps() {
  const locale = getLocale();
  const t = getMessages().ses.steps;

  return (
    <section
      id={anchors.sesSteps}
      aria-labelledby={titleId}
      className="scroll-mt-40 pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
          />
        </Reveal>

        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {buildSteps.map((step, index) => (
            <li key={step.title.en}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-3xl bg-surface p-card-sm lg:p-card">
                  <StepMarker index={index} icon={stepIcons[index] ?? Wrench} />
                  <Heading as="h3" size="h3">
                    {step.title[locale]}
                  </Heading>
                  <p className="text-base leading-relaxed text-ink/70">{step.text[locale]}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
