import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { LeadForm, type LeadObjectType } from "@/components/forms/LeadForm";
import { LeadContactCard } from "@/components/sections/LeadContactCard";
import { LeadSteps } from "@/components/sections/LeadSteps";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { anchors } from "@/content/routes";
import { getMessages } from "@/i18n/server";

type LeadSectionProps = {
  title?: string;
  lead?: string;
  defaultObjectType?: LeadObjectType;
  /** Replaces the three steps (e.g. «У заявці вже вказано» on product pages). */
  summary?: ReactNode;
  /** Product slug sent with the lead as a hidden field. */
  product?: string;
  submitLabel?: string;
  commentPlaceholder?: string;
  /** Light-blue panel (product pages) instead of the white section. */
  panel?: boolean;
  objectTypes?: LeadObjectType[];
};

const titleId = "lead-section-title";

export function LeadSection({
  title,
  lead,
  defaultObjectType,
  summary,
  product,
  submitLabel,
  commentPlaceholder,
  panel = false,
  objectTypes,
}: LeadSectionProps) {
  const messages = getMessages();
  const t = messages.leadSection;

  const content = (
    <>
      <SectionWatermark text="CONTACT" />
      <Container
        inPanel={panel}
        className={`relative ${panel ? "py-panel-y-sm lg:py-panel-y" : ""}`}
      >
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start gap-10">
            <Reveal>
              <SectionHeader
                eyebrow={t.eyebrow}
                title={title ?? t.title}
                titleId={titleId}
                lead={lead ?? t.lead}
              />
            </Reveal>

            <Reveal delay={0.06} distance={16} className="w-full">
              {summary ?? <LeadSteps steps={t.steps} />}
            </Reveal>

            <Reveal delay={0.12} distance={12} className="w-full">
              <LeadContactCard />
            </Reveal>
          </div>

          <Reveal delay={0.08} distance={16} duration={0.5}>
            <LeadForm
              defaultObjectType={defaultObjectType}
              product={product}
              submitLabel={submitLabel}
              commentPlaceholder={commentPlaceholder}
              cardTone={panel ? "white" : "surface"}
              objectTypes={objectTypes}
            />
          </Reveal>
        </div>
      </Container>
    </>
  );

  if (panel) {
    return (
      <Panel
        as="section"
        variant="sky"
        id={anchors.contacts}
        aria-labelledby={titleId}
        className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
      >
        {content}
      </Panel>
    );
  }

  return (
    <section
      id={anchors.contacts}
      aria-labelledby={titleId}
      className="relative scroll-mt-24 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
      {content}
    </section>
  );
}
