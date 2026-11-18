import { Wrench, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { StepMarker } from "@/components/ui/step-marker";

type StepsSectionProps = {
  id: string;
  titleId: string;
  eyebrow: string;
  title: string;
  lead?: string;
  steps: { title: string; text: string }[];
  /** One icon per step, in order. */
  icons: LucideIcon[];
  /** Vertical wordmark at the left edge (md+). */
  watermark?: string;
};

/** Ordered stages as surface cards with a StepMarker (solar hub, backup hub). */
export function StepsSection({ id, titleId, eyebrow, title, lead, steps, icons, watermark }: StepsSectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className="relative scroll-mt-40 overflow-hidden pt-section-sm lg:pt-section">
      {watermark ? <SectionWatermark text={watermark} /> : null}
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        </Reveal>

        <ol className={`grid grid-cols-1 gap-4 ${steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-card bg-surface p-card-sm lg:p-card">
                  <StepMarker index={index} icon={icons[index] ?? Wrench} />
                  <Heading as="h3" size="h3">
                    {step.title}
                  </Heading>
                  <p className="text-body leading-relaxed text-muted">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
