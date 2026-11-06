import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { LeadForm, type LeadObjectType } from "@/components/forms/LeadForm";
import { Description } from "@/components/ui/description";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { companyContacts, offices } from "@/content/company";
import { anchors } from "@/content/routes";
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
                    <span className="font-heading text-lg font-semibold text-ink">
                      {step.title}
                    </span>
                    <span className="text-base leading-relaxed text-ink/70">
                      {step.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <address className="mt-3 w-full border-y border-line text-sm not-italic text-ink sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {offices.map((office, index) => (
                  <div
                    key={office.id}
                    className={`flex flex-col gap-3 py-5 ${
                      index > 0
                        ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-6"
                        : "sm:pr-6"
                    }`}
                  >
                    <span className="font-heading text-sm font-semibold uppercase tracking-wide text-ink/70">
                      {office.city}
                    </span>
                  <a
                    href={office.mapHref}
                    className="inline-flex items-start gap-2.5 leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    <MapPin
                      aria-hidden
                      size={20}
                      strokeWidth={1.7}
                      className="mt-0.5 shrink-0 text-ink/70"
                    />
                    {office.address}
                  </a>
                  <a
                    href={office.phone.href}
                    className="inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    <Phone
                      aria-hidden
                      size={20}
                      strokeWidth={1.7}
                      className="text-ink/70"
                    />
                    {office.phone.display}
                  </a>
                  </div>
                ))}
              </div>
              <a
                href={companyContacts.email.href}
                className="flex items-center gap-2.5 border-t border-line py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <Mail aria-hidden size={20} strokeWidth={1.7} className="text-ink/70" />
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
