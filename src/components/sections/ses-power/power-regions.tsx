import { Calculator } from "lucide-react";
import type { CSSProperties } from "react";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { InlineLink } from "@/components/ui/inline-link";
import { InView } from "@/components/ui/in-view";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { regionPath } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { signedPercent } from "@/lib/region-copy";
import { powerValues } from "@/lib/ses-power-copy";
import type { PowerFacts } from "@/lib/ses-power-facts";

const titleId = "power-regions-title";

/**
 * «Скільки дасть СЕС 5 кВт у вашій області»: all 26 regions, sunniest first,
 * each name links to its region page. A real <table> that fits 360 px: the bar
 * column moves under the name on phones. A sticky card leads to the calculator.
 */
export function PowerRegions({ facts, locale }: { facts: PowerFacts; locale: Locale }) {
  const t = getMessages().sesPower.regions;
  const n = (value: number) => formatNumber(value, locale);
  const values = powerValues(facts, locale);
  const max = facts.sunniest.exactYear;
  const min = facts.leastSunny.exactYear;
  // Bars start at 60 % so the 30 % spread between regions stays visible.
  const width = (year: number) => `${60 + ((year - min) / (max - min || 1)) * 40}%`;

  const bar = (year: number, index: number) => (
    <span aria-hidden className="block h-2 w-full overflow-clip rounded-full bg-hover">
      <span className="grow-x block h-full rounded-full bg-accent" style={{ width: width(year), "--i": index } as CSSProperties} />
    </span>
  );

  return (
    <section id={anchors.powerRegions} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container className="flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={format(t.title, { kw: values.kw })} titleId={titleId} lead={format(t.lead, values)} />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-8">
            <InView>
              <table className="w-full text-small">
                <caption className="pb-4 text-left text-small text-muted">{format(t.caption, { kw: values.kw })}</caption>
                <thead>
                  <tr className="border-b border-line text-left text-caption text-muted">
                    <th scope="col" className="py-3 pr-3 font-medium">{t.region}</th>
                    <th scope="col" className="hidden w-2/5 py-3 pr-4 font-medium md:table-cell">{t.scale}</th>
                    <th scope="col" className="py-3 pr-3 text-right font-medium whitespace-nowrap">{t.year}</th>
                    <th scope="col" className="py-3 text-right font-medium whitespace-nowrap">{t.deviation}</th>
                  </tr>
                </thead>
                <tbody>
                  {facts.regions.map((row, index) => (
                    <tr key={row.region.id} className="border-b border-line">
                      <th scope="row" className="py-3 pr-3 text-left font-normal">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <InlineLink href={localizePath(regionPath(row.region), locale)}>{row.region.shortName[locale]}</InlineLink>
                          {row.region.yieldEstimate ? <span className="text-caption text-muted">{t.estimate}</span> : null}
                        </span>
                        {/* Phones: the bar under the name instead of its own column. */}
                        <span className="mt-2 block md:hidden">{bar(row.exactYear, index)}</span>
                      </th>
                      <td className="hidden py-3 pr-4 md:table-cell">{bar(row.exactYear, index)}</td>
                      <td className="py-3 pr-3 text-right whitespace-nowrap text-ink tabular-nums">≈ {n(row.year)}</td>
                      <td className={`py-3 text-right whitespace-nowrap tabular-nums ${row.deviation < 0 ? "text-muted" : "text-ink"}`}>
                        {signedPercent(row.deviation, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InView>
          </Reveal>

          <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:col-span-4">
            <div className="flex flex-col items-start gap-4 rounded-card bg-surface p-card-sm lg:p-card">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-full border border-line bg-white text-ink">
                <Calculator className="size-5" strokeWidth={1.7} />
              </span>
              <Heading as="h3" size="h3" weight="semibold" className="text-ink">
                {t.cardTitle}
              </Heading>
              <p className="text-body text-muted">{format(t.cardText, { kw: values.kw })}</p>
              <ArrowLink href={`#${anchors.calculator}`}>{t.cardLink}</ArrowLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
