"use client";

import { useSesPayback } from "@/components/calculator/ses-payback-state";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { insolationRegions } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { useLocale, useMessages } from "@/i18n/client";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "ses-yield-title";

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/**
 * «How much energy the plant gives by month»: bar chart of the current
 * calculation (live, from the shared calculator state), the best and the
 * worst month, and a screen-reader table with the same numbers.
 */
export function SesPaybackYield() {
  const locale = useLocale();
  const t = useMessages().sesPayback;
  const { state, result } = useSesPayback();
  const region = insolationRegions.find((item) => item.id === state.regionId) ?? insolationRegions[0];
  const months = result.generationByMonth;
  const max = Math.max(...months, result.monthlyKwh, 1);
  // The four sunniest months are dark; the rest are light accent bars.
  const peak = new Set([...months.keys()].sort((a, b) => months[b] - months[a]).slice(0, 4));
  const height = (value: number) => `${Math.max(2, (value / max) * 85)}%`;

  return (
    <section
      id={anchors.sesYield}
      aria-labelledby={titleId}
      className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="SOLAR" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.chartEyebrow}
            title={t.chartTitle}
            titleId={titleId}
            lead={format(t.chartLead, { kw: formatNumber(result.kw, locale), region: region.name[locale] })}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <figure className="flex h-full flex-col gap-6 rounded-3xl bg-surface p-card-sm lg:p-card">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-ink/70">
                <span>{t.chartLegend}</span>
                <span className="font-medium text-ink">
                  {format(t.chartTotal, { value: formatNumber(roundTo(result.generationYear, 10), locale) })}
                </span>
              </div>
              <div aria-hidden className="relative flex h-64 items-end gap-1 border-b border-line sm:gap-2">
                <div
                  className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-ink/50"
                  style={{ bottom: height(result.monthlyKwh) }}
                >
                  <span className="absolute right-0 -translate-y-full bg-surface pb-1 pl-2 text-xs text-ink/70">
                    {t.consumptionLine}
                  </span>
                </div>
                {months.map((value, index) => (
                  <div key={t.monthNames[index]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="hidden text-xs text-ink/70 tabular-nums sm:block">
                      {formatNumber(roundTo(value, 10), locale)}
                    </span>
                    <span
                      className={`w-full rounded-t-lg ${peak.has(index) ? "bg-accent-strong" : "bg-accent/35"}`}
                      style={{ height: height(value) }}
                    />
                  </div>
                ))}
              </div>
              <div aria-hidden className="-mt-4 flex gap-1 sm:gap-2">
                {t.monthNames.map((name) => (
                  <span key={name} className="min-w-0 flex-1 text-center text-xs text-ink/70">
                    {name}
                  </span>
                ))}
              </div>
              <table className="sr-only">
                <caption>{t.ariaChart}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.monthLabel}</th>
                    <th scope="col">{t.generation}</th>
                    <th scope="col">{t.consumption}</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((value, index) => (
                    <tr key={t.monthNamesFull[index]}>
                      <th scope="row">{t.monthNamesFull[index]}</th>
                      <td>{formatNumber(roundTo(value, 10), locale)} {t.kwh}</td>
                      <td>{formatNumber(result.monthlyKwh, locale)} {t.kwh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figcaption className="mt-auto text-sm text-ink/70">{t.chartCaption}</figcaption>
            </figure>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <Reveal delay={0.08} className="h-full">
              <article className="flex h-full flex-col gap-4 rounded-3xl bg-sky p-card-sm text-ink lg:p-card">
                <p className="text-sm text-ink/70">
                  {format(t.surplusText, { month: t.monthNamesFull[result.surplus.monthIndex] })}
                </p>
                <p className="flex items-baseline gap-2">
                  <span className="font-heading text-number-sm font-light tabular-nums">
                    +{formatNumber(roundTo(result.surplus.kwh, 10), locale)}
                  </span>
                  <span className="text-sm text-ink/70">{t.perMonth}</span>
                </p>
                <p className="mt-auto text-sm text-ink/70">{t.surplusHint}</p>
              </article>
            </Reveal>
            <Reveal delay={0.16} className="h-full">
              <article className="flex h-full flex-col gap-4 rounded-3xl bg-navy p-card-sm text-white lg:p-card">
                <p className="text-sm text-white/75">
                  {format(t.deficitText, { month: t.monthNamesFull[result.deficit.monthIndex] })}
                </p>
                <p className="flex items-baseline gap-2">
                  <span className="font-heading text-number-sm font-light tabular-nums">
                    −{formatNumber(roundTo(result.deficit.kwh, 10), locale)}
                  </span>
                  <span className="text-sm text-white/75">{t.perMonth}</span>
                </p>
                <p className="mt-auto text-sm text-white/75">{t.deficitHint}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
