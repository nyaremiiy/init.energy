import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { StepsList } from "@/components/ui/steps-list";

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

/** Ordered stages as rows (StepsList): solar hub, backup hub. */
export function StepsSection({ id, titleId, eyebrow, title, lead, steps, icons, watermark }: StepsSectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className="relative scroll-mt-40 overflow-hidden pt-section-sm lg:pt-section">
      {watermark ? <SectionWatermark text={watermark} /> : null}
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        </Reveal>

        <StepsList steps={steps} icons={icons} />
      </Container>
    </section>
  );
}
