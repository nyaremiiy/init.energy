import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { LeadForm, type LeadObjectType } from "@/components/forms/LeadForm";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { companyContacts, offices } from "@/content/company";
import { anchors } from "@/content/routes";
import { formatPhone } from "@/lib/format";
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
}: LeadSectionProps) {
  const messages = getMessages();
  const t = messages.leadSection;
  const primaryPhone = offices[0].phone;

  const content = (
    <>
      <SectionWatermark text="CONTACT" />
      <Container
        inPanel={panel}
        className={`relative ${panel ? "py-panel-y-sm lg:py-panel-y" : ""}`}
      >
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Reveal>
              <SectionHeader
                eyebrow={t.eyebrow}
                title={title ?? t.title}
                titleId={titleId}
                lead={lead ?? t.lead}
              />
            </Reveal>

            <Reveal delay={0.06} distance={16} className="w-full">
              {summary ?? (
                <ol className="mt-6 w-full list-none border-b border-line p-0">
                  {t.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="flex gap-4 border-t border-line py-5"
                    >
                      <span className="w-10 shrink-0 pt-1 font-heading text-sm font-medium text-ink/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-col gap-1">
                        <Heading as="h3" size="h3" className="text-ink">
                          {step.title}
                        </Heading>
                        <span className="text-base leading-relaxed text-ink/70">
                          {step.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Reveal>

            <Reveal delay={0.12} distance={12}>
              <address className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm not-italic text-ink sm:text-base">
                <a
                  href={primaryPhone.href}
                  className="inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <Phone
                    aria-hidden
                    size={20}
                    strokeWidth={1.7}
                    className="shrink-0 text-ink/70"
                  />
                  {formatPhone(primaryPhone.display)}
                </a>
                <a
                  href={companyContacts.email.href}
                  className="inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <Mail
                    aria-hidden
                    size={20}
                    strokeWidth={1.7}
                    className="shrink-0 text-ink/70"
                  />
                  {companyContacts.email.display}
                </a>
              </address>
            </Reveal>
          </div>

          <Reveal delay={0.08} distance={16} duration={0.5}>
            <LeadForm
              defaultObjectType={defaultObjectType}
              product={product}
              submitLabel={submitLabel}
              commentPlaceholder={commentPlaceholder}
              cardTone={panel ? "white" : "surface"}
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
