import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { insolationRegions } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { svitModelCount, usableShare } from "@/content/storage";
import { householdTariff } from "@/content/tariffs";
import { getLocale, getMessages } from "@/i18n/server";
import type { SesCalculation } from "@/lib/calc/ses";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "ses-method-title";

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/**
 * «How we calculate»: the four formulas, the data sources and a worked
 * example for the default inputs. The example is a self-contained sentence
 * with real numbers, so search and AI answers can quote it as is.
 */
export function SesPaybackMethod({ example }: { example: SesCalculation }) {
  const locale = getLocale();
  const t = getMessages().sesPayback;
  const region = insolationRegions.find((item) => item.id === "lvivska") ?? insolationRegions[0];
  const sources = [
    { label: t.yieldSource, value: t.yieldSourceDetail },
    { label: t.houseTariff, value: `${formatNumber(householdTariff.value, locale)} ${t.tariffUnit} · ${t.tariffSource}` },
    { label: t.productModels, value: String(svitModelCount) },
    { label: t.appliancePower, value: t.applianceSource },
  ];
  const exampleText = format(t.example, {
    region: region.name[locale],
    kwh: formatNumber(example.monthlyKwh, locale),
    type: example.plantType === "grid" ? t.exampleTypes.grid : t.exampleTypes.hybrid,
    kw: formatNumber(example.kw, locale),
    generation: formatNumber(roundTo(example.generationYear, 10), locale),
    battery: example.battery
      ? format(t.exampleBattery, {
          battery: example.battery.name,
          hours: formatNumber(Math.round(example.battery.backupHours), locale),
        })
      : "",
  });

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.sesMethod}
      aria-labelledby={titleId}
      className="scroll-mt-28 pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="METHOD" side="right" tone="dark" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader tone="dark" eyebrow={t.methodEyebrow} title={t.howTitle} titleId={titleId} lead={t.methodLead} />
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ol className="border-b border-line-dark">
              {t.formulaRows.map((formula, index) => (
                <li
                  key={formula}
                  className="grid grid-cols-1 gap-2 border-t border-line-dark py-5 sm:grid-cols-12 sm:gap-6"
                >
                  <h3 className="flex items-baseline gap-4 font-heading text-body font-semibold text-white sm:col-span-5">
                    <span className="text-small font-medium text-muted-dark tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {t.formulaTitles[index]}
                  </h3>
                  <p className="font-mono text-small text-muted-dark sm:col-span-7">
                    {format(formula, { share: `${formatNumber(usableShare * 100, locale)}%` })}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-body leading-relaxed text-white">{exampleText}</p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <aside className="flex flex-col gap-6 rounded-card bg-fill-dark p-card-sm lg:p-card">
              <h3 className="font-heading text-h3-sm font-medium text-white sm:text-h3">{t.inputData}</h3>
              <dl className="border-b border-line-dark text-small">
                {sources.map((row) => (
                  <div key={row.label} className="flex justify-between gap-6 border-t border-line-dark py-3">
                    <dt className="text-muted-dark">{row.label}</dt>
                    <dd className="text-right text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-small leading-relaxed text-muted-dark">{t.notIncluded}</p>
              <p className="text-small text-muted-dark">{format(t.updatedLine, { count: String(insolationRegions.length) })}</p>
            </aside>
          </Reveal>
        </div>
      </Container>
    </Panel>
  );
}
