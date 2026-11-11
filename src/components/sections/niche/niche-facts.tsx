import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { anchors } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { nicheTones } from "./niche-ui";

const titleId = "niche-facts-title";

/** «… in numbers»: a direct answer, the key parameters and four headline figures. */
export function NicheFacts({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const t = getMessages().nichePage;
  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", { dateStyle: "long" }).format(new Date(page.updatedAt));

  return (
    <section
      id={anchors.nicheFacts}
      aria-labelledby={titleId}
      className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="HOTEL" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrows.facts} title={page.facts.title[locale]} titleId={titleId} />
        </Reveal>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-6 lg:col-span-6">
            <p className="text-base leading-relaxed text-ink sm:text-lg">{page.facts.lead[locale]}</p>
            <dl aria-label={t.factsTableLabel} className="border-b border-line">
              {page.facts.rows.map((row) => (
                <div key={row.label.en} className="grid grid-cols-2 gap-4 border-t border-line py-3 text-sm sm:text-base">
                  <dt className="text-ink/70">{row.label[locale]}</dt>
                  <dd className="font-medium text-ink">{row.value[locale]}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-ink/70">
              <time dateTime={page.updatedAt}>{format(t.updated, { date: updated })}</time>
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6">
            <dl aria-label={t.factsCardsLabel} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {page.facts.cards.map((card) => {
                const tone = nicheTones[card.tone];
                return (
                  <div key={card.value.en} className={`flex min-h-48 flex-col-reverse justify-between gap-6 rounded-3xl p-card-sm lg:p-card ${tone.card}`}>
                    <dt className={`text-sm ${tone.muted}`}>{card.label[locale]}</dt>
                    <dd className="font-heading text-number-sm font-light tracking-tight whitespace-nowrap">{card.value[locale]}</dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
