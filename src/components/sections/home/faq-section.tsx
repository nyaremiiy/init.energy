import { Phone } from "lucide-react";

import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { offices } from "@/content/company";
import { faqForPage, faqTopics } from "@/content/faq";
import { anchors, routes } from "@/content/routes";
import { formatPhone } from "@/lib/format";
import { messages } from "@/lib/messages";
import { faqPageSchema } from "@/lib/seo/schema";

const titleId = "faq-title";
// Ukrainian only for now; pass the locale once i18n routing lands.
const locale = "uk";

/** Server section: header + contact card (sticky on lg) and the client accordion. */
export function FaqSection() {
  const t = messages.faq;
  const faqs = faqForPage("home");
  const phone = offices[0].phone;
  const items = faqs.map((faq) => ({
    id: faq.id,
    topic: faq.topic,
    question: faq.question[locale],
    answer: faq.answer[locale],
  }));

  return (
    <section
      id={anchors.faq}
      aria-labelledby={titleId}
      className="relative scroll-mt-24 overflow-clip bg-white pt-section-sm lg:pt-section"
    >
      {/* Structured data for all questions, whatever topic is selected. */}
      <JsonLd data={faqPageSchema(items)} />
      <SectionWatermark text="FAQ" side="right" />
      <Container className="relative grid grid-cols-1 gap-section-head-sm lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal className="flex flex-col gap-section-head-sm lg:sticky lg:top-28">
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              titleId={titleId}
              lead={t.lead}
            />
            <div className="flex flex-col items-start gap-3 rounded-3xl bg-surface p-card-sm lg:p-card">
              <p className="font-heading text-h3-sm font-medium text-ink sm:text-h3">
                {t.help.title}
              </p>
              <p className="text-base text-ink/70">{t.help.text}</p>
              <a
                href={phone.href}
                className="inline-flex items-center gap-2 text-base font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-tech hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <Phone aria-hidden className="size-4.5" />
                {formatPhone(phone.display)}
              </a>
              <ArrowLink href={routes.sections.contacts}>
                {t.help.link}
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <FaqAccordion
            items={items}
            topics={faqTopics.map((topic) => ({
              id: topic,
              label: t.topics[topic],
            }))}
            labels={{ filter: t.filterLabel, all: t.all }}
          />
        </div>
      </Container>
    </section>
  );
}
