import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { LeadForm, type LeadObjectType } from "@/components/forms/LeadForm";
import { LeadContactCard } from "@/components/sections/LeadContactCard";
import { LeadSteps } from "@/components/sections/LeadSteps";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
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
  objectTypes?: LeadObjectType[];
};

const titleId = "lead-section-title";
// The same roof photo on every page (owner decision); decorative, so alt="".
const photo = "/images/home/promo/ses-roof-1920.avif";

/**
 * Lead section on every page: one bordered card. Left (5 of 11): photo under
 * a dark scrim with the header, steps (or the product summary) and contacts.
 * Right (6 of 11): the lead form. Mobile: the dark part on top, the form below.
 */
export function LeadSection({
  title,
  lead,
  defaultObjectType,
  summary,
  product,
  submitLabel,
  commentPlaceholder,
  objectTypes,
}: LeadSectionProps) {
  const t = getMessages().leadSection;

  return (
    <section
      id={anchors.contacts}
      aria-labelledby={titleId}
      className="relative scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container>
        <div className="grid grid-cols-1 overflow-clip rounded-panel-sm border border-line sm:rounded-panel lg:grid-cols-11">
          <div className="relative isolate text-white lg:col-span-5">
            <Image src={photo} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="-z-10 object-cover" />
            <div aria-hidden className="absolute inset-0 -z-10 scrim-lead" />

            <div className="flex h-full flex-col justify-between gap-10 p-card-sm lg:p-14">
              <Reveal>
                <SectionHeader
                  eyebrow={t.eyebrow}
                  title={title ?? t.title}
                  titleId={titleId}
                  lead={lead ?? t.lead}
                  tone="dark"
                />
              </Reveal>

              <Reveal delay={0.06} distance={16} className="w-full">
                {summary ?? <LeadSteps steps={t.steps} />}
              </Reveal>

              <Reveal delay={0.12} distance={12} className="w-full">
                <LeadContactCard variant="inline" />
              </Reveal>
            </div>
          </div>

          <div className="flex items-center bg-white p-2 lg:col-span-6 lg:p-10">
            <Reveal delay={0.08} distance={16} duration={0.5} className="w-full">
              <LeadForm
                defaultObjectType={defaultObjectType}
                product={product}
                submitLabel={submitLabel}
                commentPlaceholder={commentPlaceholder}
                objectTypes={objectTypes}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
