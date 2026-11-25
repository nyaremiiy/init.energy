import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { backupLoadSets, backupRuntimeProducts, loadSetPowerW, outageExample } from "@/content/backup";
import type { InsolationRegion } from "@/content/insolation";
import { products, type ProductId } from "@/content/products";
import { anchors, routes } from "@/content/routes";
import { capacityWh, usableShare } from "@/content/storage";
import { localizePath, type Locale } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { setRuntime, loadSetById } from "@/lib/backup-region-copy";
import { chargeAfter, dayChargeCurve } from "@/lib/calc/backup-day";
import { formatNumber, formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "backup-region-runtime-title";

/** Bar colours per product (a chart, so `accent` is allowed): light → strong. */
const barColours = ["bg-scale-3", "bg-accent", "bg-ink"] as const;
/** Recharge after the grid returns, hours to full — illustrative only (content/ has no charge rate). */
const RECHARGE_HOURS = 2.5;
const AXIS_HOURS = [0, 4, 8, 12, 16, 20, 24];

const time = (hour: number) => `${String(Math.floor(hour)).padStart(2, "0")}:00`;

/** «Години роботи без мережі»: horizontal bars, labels always visible, an sr-only table with the same numbers. */
function HoursChart({ locale }: { locale: Locale }) {
  const t = getMessages().backupRegionPage.runtime;
  const n = (value: number) => formatNumber(value, locale);
  const rows = backupLoadSets.map((set) => ({
    set,
    loadW: loadSetPowerW(set),
    values: backupRuntimeProducts.map(({ id }) => ({ id, hours: setRuntime(set, id) })),
  }));
  const max = Math.max(...rows.flatMap((row) => row.values.map((value) => value.hours ?? 0)));

  return (
    <figure className="flex h-full flex-col gap-6 rounded-card border border-line bg-white p-card-sm lg:p-card">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <Heading as="h3" size="h3" weight="semibold" className="text-ink">
            {t.chartTitle}
          </Heading>
          <span className="text-small text-muted">{t.chartUnit}</span>
        </div>
        <ul aria-label={t.legendLabel} className="flex flex-wrap gap-x-5 gap-y-1 text-small text-muted">
          {backupRuntimeProducts.map(({ id }, index) => (
            <li key={id} className="flex items-center gap-2">
              <span aria-hidden className={`size-2.5 rounded-full ${barColours[index]}`} />
              {products[id].name}
            </li>
          ))}
        </ul>
      </div>

      <div aria-hidden className="flex flex-col">
        {rows.map((row) => (
          <div key={row.set.id} className="flex flex-col gap-2 border-t border-line py-5 first:border-t-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body font-medium text-ink">{row.set.label[locale]}</span>
              <span className="shrink-0 text-caption text-muted tabular-nums">{formatQuantity({ value: row.loadW, unit: "W" }, locale)}</span>
            </div>
            {row.values.map(({ id, hours }, index) => (
              <div key={id} className="grid grid-cols-1 gap-1 sm:grid-cols-runtime-bar sm:items-center sm:gap-3">
                <span className="text-small text-muted">{products[id].name}</span>
                {hours === null ? (
                  <span className="text-caption text-muted">{row.set.overload[locale]}</span>
                ) : (
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2.5 shrink-0 rounded-full ${barColours[index]}`}
                      style={{ width: `${Math.max(3, (hours / max) * 82)}%` }}
                    />
                    <span className="text-small whitespace-nowrap text-ink tabular-nums">{format(t.hours, { hours: n(hours) })}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>{t.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.tableSet}</th>
            {backupRuntimeProducts.map(({ id }) => (
              <th key={id} scope="col">
                {products[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.set.id}>
              <th scope="row">
                {row.set.label[locale]}, {formatQuantity({ value: row.loadW, unit: "W" }, locale)}
              </th>
              {row.values.map(({ id, hours }) => (
                <td key={id}>{hours === null ? row.set.overload[locale] : format(t.hours, { hours: n(hours) })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption className="mt-auto text-caption text-muted">
        {format(t.footnote, { share: `${n(usableShare * 100)}%` })}
      </figcaption>
    </figure>
  );
}

/** Dark card: the house set on the example product, with the formula. */
function ExampleCard({ locale }: { locale: Locale }) {
  const t = getMessages().backupRegionPage.runtime.example;
  const unitHours = getMessages().backupRegionPage.runtime.hours;
  const set = loadSetById(outageExample.loadSet);
  const id: ProductId = outageExample.product;
  const loadW = loadSetPowerW(set);
  const hours = setRuntime(set, id) ?? 0;
  const n = (value: number) => formatNumber(value, locale);
  // «≈ 4,3 год» → the figure large, the unit small.
  const parts = format(unitHours, { hours: n(hours) }).split(" ");
  const unit = parts.pop();

  return (
    <article className="flex h-full flex-col gap-5 rounded-card bg-ink-glow p-card-sm text-white lg:p-card">
      <Eyebrow tone="dark">{format(t.label, { product: products[id].name })}</Eyebrow>
      <p className="flex items-baseline gap-3 font-heading font-light tracking-tight whitespace-nowrap tabular-nums">
        <span className="text-number-sm lg:text-number">{parts.join(" ")}</span>
        <span className="text-h3-sm">{unit}</span>
      </p>
      <p className="text-body leading-relaxed text-muted-dark">
        {format(t.text, { load: formatQuantity({ value: loadW, unit: "W" }, locale), outage: n(outageExample.hours) })}
      </p>
      <p className="flex flex-col gap-1 rounded-tile border border-line-dark bg-fill-dark p-4 text-small">
        <span className="text-muted-dark">{t.formulaLabel}</span>
        <span className="tabular-nums">
          {format(t.formula, {
            // Same units on both sides, exact figures: «4 608 Вт·год ÷ 1 068 Вт».
            usable: formatQuantity({ value: Math.round(capacityWh(id) * usableShare), unit: "Wh" }, locale),
            load: formatQuantity({ value: loadW, unit: "W" }, locale),
            hours: n(hours),
          })}
        </span>
      </p>
      <p className="text-small text-muted-dark">{format(t.more, { extra: products.svitPlus5000.name })}</p>
      <ArrowLink tone="dark" href={`${localizePath(routes.calculators.sesPayback, locale)}#${anchors.calculator}`} className="mt-auto self-start">
        {t.link}
      </ArrowLink>
    </article>
  );
}

/** «Доба з двома відключеннями»: the charge line of the example product (lines in SVG, labels in HTML so they stay legible at 360 px). */
function DayChart({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().backupRegionPage.runtime.day;
  const set = loadSetById(outageExample.loadSet);
  const id = outageExample.product;
  const loadW = loadSetPowerW(set);
  const capacity = capacityWh(id);
  const curve = dayChargeCurve({ starts: outageExample.starts, hours: outageExample.hours, loadW, capacityWh: capacity, rechargeHours: RECHARGE_HOURS });
  const minimum = Math.round(chargeAfter(outageExample.hours, loadW, capacity));
  const n = (value: number) => formatNumber(value, locale);
  const operator = region.gridOperator?.name[locale];
  const [first, second] = outageExample.starts;
  const line = curve.map((point) => `${point.hour * 10},${100 - point.percent}`).join(" ");
  const lows = curve.filter((point, index) => index > 0 && curve[index - 1].percent > point.percent);

  return (
    <figure className="flex flex-col gap-6 rounded-card border border-line bg-white p-card-sm lg:p-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex max-w-3xl flex-col gap-2">
          <Heading as="h3" size="h3" weight="semibold" className="text-ink">
            {format(t.title, { hours: n(outageExample.hours) })}
          </Heading>
          <p className="text-body text-muted">
            {format(t.text, {
              load: formatQuantity({ value: loadW, unit: "W" }, locale),
              product: products[id].name,
              hours: n(outageExample.hours),
              min: n(minimum),
            })}
          </p>
        </div>
        <ul aria-hidden className="flex shrink-0 gap-5 text-small text-muted">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-accent" />
            {t.legendCharge}
          </li>
          <li className="flex items-center gap-2">
            <span className="size-3 border border-line bg-hover" />
            {t.legendOutage}
          </li>
        </ul>
      </div>

      <div
        role="img"
        aria-label={format(t.aria, {
          start1: time(first),
          end1: time(first + outageExample.hours),
          start2: time(second),
          end2: time(second + outageExample.hours),
          min: n(minimum),
        })}
        className="grid grid-cols-chart-axis gap-x-2"
      >
        <div aria-hidden className="flex h-48 flex-col justify-between text-right text-caption text-muted tabular-nums sm:h-56">
          <span className="-translate-y-1/2">100%</span>
          <span>50%</span>
          <span className="translate-y-1/2">0%</span>
        </div>
        <div aria-hidden className="relative h-48 border-b border-line sm:h-56">
          {outageExample.starts.map((start) => (
            <div
              key={start}
              className="absolute inset-y-0 bg-hover"
              style={{ left: `${(start / 24) * 100}%`, width: `${(outageExample.hours / 24) * 100}%` }}
            >
              <span className="hidden pt-1 text-center text-caption text-muted sm:block">{t.outage}</span>
            </div>
          ))}
          <svg viewBox="0 0 240 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <polygon points={`0,100 ${line} 240,100`} className="fill-sky" />
            <line x1="0" x2="240" y1="50" y2="50" className="stroke-line" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <polyline points={line} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {lows.map((point) => (
            // The dot on the line, the value centred under it: two lows never overlap, even at 360 px.
            <span
              key={point.hour}
              className="absolute flex -translate-x-1/2 flex-col items-center gap-1"
              style={{ left: `${(point.hour / 24) * 100}%`, top: `calc(${100 - point.percent}% - 0.375rem)` }}
            >
              <span className="size-3 rounded-full border-2 border-accent bg-white" />
              <span className="text-caption whitespace-nowrap text-ink tabular-nums">≈ {n(Math.round(point.percent))}%</span>
            </span>
          ))}
        </div>
        <span />
        <div aria-hidden className="flex justify-between pt-2 text-caption text-muted tabular-nums">
          {AXIS_HOURS.map((hour) => (
            <span key={hour} className={hour % 8 === 4 ? "hidden sm:inline" : undefined}>
              {time(hour)}
            </span>
          ))}
        </div>
      </div>

      <figcaption className="text-small text-muted">{operator ? format(t.note, { operator }) : t.noteGeneric}</figcaption>
    </figure>
  );
}

/**
 * «Скільки протримається система» on a backup region page: hours for typical
 * sets (lib/calc/backup-runtime.ts, the same numbers as the hub table), the
 * example card and a day with two outages. Nothing is hardcoded.
 */
export function BackupRegionRuntime({ region }: { region: InsolationRegion }) {
  const locale = getLocale();
  const t = getMessages().backupRegionPage.runtime;

  return (
    <section id={anchors.backupRuntime} aria-labelledby={titleId} className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="HOURS" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={<ArrowLink href={`${localizePath(routes.calculators.sesPayback, locale)}#${anchors.calculator}`}>{t.calcLink}</ArrowLink>}
          />
        </Reveal>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <HoursChart locale={locale} />
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5">
              <ExampleCard locale={locale} />
            </Reveal>
          </div>
          <Reveal>
            <DayChart region={region} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
