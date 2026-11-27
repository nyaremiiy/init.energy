import { CalendarDays, Gauge, LayoutGrid, Ruler, Sun, Wallet, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StepMarker } from "@/components/ui/step-marker";
import { insolationRegions } from "@/content/insolation";
import type { SesPowerPage } from "@/content/ses-power";
import { anchors } from "@/content/routes";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatDate, formatMonthYear, formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { powerValues } from "@/lib/ses-power-copy";
import type { PowerFacts } from "@/lib/ses-power-facts";

const titleId = "power-figures-title";

type Card = { id: string; icon: LucideIcon; label: string; value: ReactNode; unit?: string; note: string; accent?: boolean };

/**
 * «СЕС 5 кВт у цифрах»: a white section right after the dark hero, six cards
 * (number + icon), savings as the dark accent card. Every value is computed.
 */
export function PowerFigures({ page, facts, locale }: { page: SesPowerPage; facts: PowerFacts; locale: Locale }) {
  const messages = getMessages();
  const t = messages.sesPower.figures;
  const units = messages.units;
  const values = powerValues(facts, locale);
  const n = (value: number) => formatNumber(value, locale);

  const cards: Card[] = [
    { id: "power", icon: Gauge, label: t.power, value: <CountUp value={facts.kw} />, unit: units.kW, note: t.powerNote },
    { id: "panels", icon: LayoutGrid, label: t.panels, value: `${values.panels} × ${values.panelMin}–${values.panelMax}`, unit: units.W, note: t.panelsNote },
    { id: "area", icon: Ruler, label: t.area, value: <>≈ <CountUp value={facts.area} /></>, unit: t.m2, note: t.areaNote },
    { id: "year", icon: Sun, label: t.year, value: <>≈ <CountUp value={facts.year} /></>, unit: units.kWh, note: t.yearNote },
    { id: "month", icon: CalendarDays, label: t.month, value: <>≈ <CountUp value={facts.month} /></>, unit: units.kWh, note: t.monthNote },
    {
      id: "savings",
      icon: Wallet,
      label: t.savings,
      value: format(t.savingsValue, { value: n(facts.savings) }),
      unit: t.currency,
      note: format(t.savingsNote, { tariff: n(facts.tariff.value) }),
      accent: true,
    },
  ];

  return (
    <section id={anchors.powerFigures} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container className="flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={format(t.title, { kw: values.kw })}
            titleId={titleId}
            lead={format(t.lead[page.segment], values)}
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <Reveal key={card.id} delay={index * 0.05} className="flex">
                <div
                  className={`flex flex-1 flex-col gap-3 rounded-card p-card-sm lg:p-card ${card.accent ? "bg-ink-glow text-white" : "bg-surface text-ink"}`}
                >
                  {/* dt first in the markup (valid <dl>); the marker, value and note are dd, the label shows under the value. */}
                  <dt className={`order-2 text-body font-medium ${card.accent ? "text-white" : "text-ink"}`}>{card.label}</dt>
                  <dd aria-hidden className="order-0">
                    <StepMarker index={index} icon={card.icon} tone={card.accent ? "dark" : "light"} />
                  </dd>
                  <dd className="order-1 mt-4 flex items-baseline gap-2 font-heading text-stat-sm font-medium whitespace-nowrap tabular-nums sm:text-stat">
                    {card.value}
                    {card.unit ? (
                      <span className={`font-sans text-small font-normal ${card.accent ? "text-muted-dark" : "text-muted"}`}>{card.unit}</span>
                    ) : null}
                  </dd>
                  <dd className={`order-3 text-small ${card.accent ? "text-muted-dark" : "text-muted"}`}>{card.note}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <p className="text-small text-muted">
            {format(t.sources, {
              count: n(insolationRegions.length),
              tariff: n(facts.tariff.value),
              validUntil: formatDate(facts.tariff.validUntil, locale),
            })}{" "}
            <time dateTime={page.updatedAt}>{format(t.updated, { date: formatMonthYear(page.updatedAt, locale) })}</time>
          </p>
        </div>
      </Container>
    </section>
  );
}
