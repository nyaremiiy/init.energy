import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { appliances } from "@/content/appliances";
import {
  backupLoadSets,
  backupRuntimeProducts,
  capacityWh,
  loadSetPowerW,
  outputLimitW,
  usableShare,
} from "@/content/backup";
import { products } from "@/content/products";
import { anchors, routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { exceedsOutput, roundHours, runtimeHours } from "@/lib/calc/backup-runtime";
import { formatNumber, formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "backup-runtime-title";

/** Horizontal padding of a value column (first one flush with the row labels on mobile). */
const pad = (index: number) => (index === 0 ? "pr-3 sm:pr-5 md:pl-5" : "px-3 sm:px-5");

/**
 * «Скільки протримається система»: hours computed from content/appliances.ts
 * and product capacities (usable share 90 %), never hardcoded. Mobile: each
 * row is the load set above its three values, no horizontal scroll.
 */
export function BackupRuntime() {
  const locale = getLocale();
  const t = getMessages().backup.runtime;
  const pumpW = appliances.find((item) => item.id === "pump")?.powerW ?? 0;

  return (
    <section id={anchors.backupRuntime} aria-labelledby={titleId} className="relative scroll-mt-40 overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="HOURS" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={<ArrowLink href={localizePath(routes.calculators.sesPayback, locale)}>{t.calcLink}</ArrowLink>}
          />
        </Reveal>

        <Reveal className="flex flex-col gap-6">
          <div role="table" aria-label={t.caption} className="text-small">
            <div role="row" className="grid grid-cols-3 items-end md:grid-cols-4">
              <span role="columnheader" className="hidden md:block">
                <span className="sr-only">{t.loadHeader}</span>
              </span>
              {backupRuntimeProducts.map(({ id, withInverter }, index) => {
                const product = products[id];
                const output = outputLimitW(id);
                const sub = [
                  formatQuantity(product.capacity, locale),
                  withInverter ? t.withInverter : output ? formatQuantity(output >= 1000 ? { value: output / 1000, unit: "kW" } : { value: output, unit: "W" }, locale) : null,
                ].filter(Boolean);
                return (
                  <span key={id} role="columnheader" className={`flex flex-col gap-1 py-4 ${pad(index)}`}>
                    <span className="font-heading text-body font-semibold text-ink">{product.name}</span>
                    <span className="text-caption text-muted">{sub.join(" · ")}</span>
                  </span>
                );
              })}
            </div>

            {backupLoadSets.map((set) => {
              const loadW = loadSetPowerW(set);
              return (
                <div key={set.id} role="row" className="grid grid-cols-3 border-t border-line md:grid-cols-4">
                  <span role="rowheader" className="col-span-3 flex flex-col gap-0.5 pt-4 md:col-span-1 md:justify-center md:py-5 md:pr-4">
                    <span className="font-medium text-ink">{set.label[locale]}</span>
                    <span className="text-caption text-muted">{formatQuantity({ value: loadW, unit: "W" }, locale)}</span>
                  </span>
                  {backupRuntimeProducts.map(({ id }, index) => {
                    const over = exceedsOutput(loadW, outputLimitW(id));
                    const hours = roundHours(runtimeHours(capacityWh(id), loadW, usableShare));
                    return (
                      <span key={id} role="cell" className={`flex items-center py-4 md:py-5 ${pad(index)}`}>
                        {over ? (
                          <span className="text-small text-muted">— {set.overload[locale]}</span>
                        ) : (
                          <span className="font-heading text-stat-sm whitespace-nowrap text-ink tabular-nums sm:text-stat">
                            {format(t.hours, { hours: formatNumber(hours, locale) })}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            })}
            <div aria-hidden className="border-t border-line" />
          </div>

          <p className="max-w-4xl text-caption text-muted">
            {format(t.footnote, {
              share: `${formatNumber(usableShare * 100, locale)}%`,
              pump: formatQuantity({ value: pumpW / 1000, unit: "kW" }, locale),
            })}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
