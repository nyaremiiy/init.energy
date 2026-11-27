import type { CSSProperties } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { InView } from "@/components/ui/in-view";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors } from "@/content/routes";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { roundMonth } from "@/lib/calc/region-yield";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import type { PowerFacts } from "@/lib/ses-power-facts";

const titleId = "power-yield-title";

/**
 * «Скільки виробляє СЕС 5 кВт по місяцях»: a light panel with a white chart
 * card — 12 bars at the national average, the two largest months in accent,
 * values above the bars and an sr-only table with the same numbers.
 */
export function PowerYield({ facts, locale }: { facts: PowerFacts; locale: Locale }) {
  const messages = getMessages();
  const t = messages.sesPower.yield;
  const months = messages.regionPage;
  const n = (value: number) => formatNumber(value, locale);
  const max = Math.max(...facts.months);
  const peaks = new Set(facts.peaks);

  return (
    <Panel as="section" variant="light" id={anchors.powerYield} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={format(t.title, { kw: n(facts.kw) })}
            titleId={titleId}
            lead={format(t.lead, {
              peak1: months.monthsLocative[facts.peaks[0]],
              peak2: months.monthsLocative[facts.peaks[1]].replace(/^(у|в|in)\s+/, ""),
              best: n(facts.best),
              lowest: months.monthsLocative[facts.lowest.index],
              low: n(facts.lowest.kwh),
            })}
          />
        </Reveal>

        <Reveal>
          <figure className="flex flex-col gap-6 rounded-card bg-white p-card-sm lg:p-card">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Heading as="h3" size="h3" weight="semibold" className="text-ink">
                {t.chartTitle}
              </Heading>
              <span className="text-small text-muted">{t.chartUnit}</span>
            </div>

            <InView aria-hidden className="flex h-64 items-end gap-1 border-b border-line sm:gap-2 lg:h-72">
              {facts.months.map((value, index) => (
                <div key={months.monthsShort[index]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                  <span className="hidden text-caption text-muted tabular-nums sm:block">{n(roundMonth(value))}</span>
                  <span
                    className={`grow-y w-full rounded-t-tile ${peaks.has(index) ? "bg-accent" : "bg-scale-2"}`}
                    style={{ height: `${(value / max) * 85}%`, "--i": index } as CSSProperties}
                  />
                </div>
              ))}
            </InView>
            <div aria-hidden className="-mt-4 flex gap-1 sm:gap-2">
              {months.monthsShort.map((name) => (
                <span key={name} className="min-w-0 flex-1 text-center text-caption text-muted">
                  {/* One letter on phones: twelve short names do not fit at 360 px. */}
                  <span className="sm:hidden">{name.charAt(0)}</span>
                  <span className="hidden sm:inline">{name}</span>
                </span>
              ))}
            </div>

            <table className="sr-only">
              <caption>{format(t.tableCaption, { kw: n(facts.kw) })}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.tableMonth}</th>
                  <th scope="col">{t.tableKwh}</th>
                </tr>
              </thead>
              <tbody>
                {facts.months.map((value, index) => (
                  <tr key={months.monthsLong[index]}>
                    <th scope="row">{months.monthsLong[index]}</th>
                    <td>{n(roundMonth(value))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </Reveal>
      </Container>
    </Panel>
  );
}
