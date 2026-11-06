import { Mail, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { LeadForm, type LeadObjectType } from "@/components/forms/LeadForm";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { companyContacts, offices } from "@/content/company";
import { anchors } from "@/content/routes";
import { formatPhone } from "@/lib/format";
import { messages } from "@/lib/messages";

type LeadSectionProps = {
  title?: string;
  lead?: string;
  defaultObjectType?: LeadObjectType;
};

const titleId = "lead-section-title";

export function LeadSection({
  title,
  lead,
  defaultObjectType,
}: LeadSectionProps) {
  const t = messages.leadSection;
  const primaryPhone = offices[0].phone;

  return (
    <section
      id={anchors.contacts}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white py-section-sm lg:py-section"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Label tone="onLight">{t.eyebrow}</Label>
            <Heading
              as="h2"
              id={titleId}
              className="text-3xl text-ink sm:text-4xl lg:text-5xl"
            >
              {title ?? t.title}
            </Heading>
            <Description tone="onLight" className="max-w-xl">
              {lead ?? t.lead}
            </Description>

            <ol className="mt-6 w-full list-none border-b border-line p-0">
              {t.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-5"
                >
                  <span className="font-heading text-sm font-medium text-ink/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-heading text-lg leading-tight font-semibold tracking-tight text-ink">
                      {step.title}
                    </span>
                    <span className="text-base leading-relaxed text-ink/70">
                      {step.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

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
          </div>

          <LeadForm defaultObjectType={defaultObjectType} />
        </div>
      </Container>
    </section>
  );
}
