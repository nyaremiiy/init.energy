"use client";

import { ArrowUpRight, BatteryCharging, CalendarClock, Gauge, MapPin, Percent, PlugZap, Receipt, Sun, Wallet, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { NumberField, RangeField, SelectField } from "@/components/calculator/calculator-fields";
import { ResultSummary } from "@/components/calculator/result-summary";
import { useLeadAttachment } from "@/components/calculator/use-lead-attachment";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { RadioPills } from "@/components/ui/form/radio-pills";
import { insolationRegions, monthlyShare, regionsByLocale } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { useLocale } from "@/i18n/client";
import { trackEvent } from "@/lib/analytics";
import { roundYear, stationMonths } from "@/lib/calc/region-yield";
import { fixedPlantEstimate } from "@/lib/calc/ses-power";
import { pickSolarPlan } from "@/lib/calculator";
import { goToLeadForm, type CalculatorObjectType } from "@/lib/calculator-bridge";
import { buildCalculatorLeadData, type CalculatorValue } from "@/lib/calculator-lead";
import { buildCalculatorSummary } from "@/lib/calculator-summary";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

type PlantType = "grid" | "hybrid" | "battery";
type Field = "regionId" | "monthlyKwh" | "tariff" | "plantType" | "cost";

export type PowerCalculatorLabels = {
  region: string; regionHint: string;
  consumption: string; consumptionHint: string;
  tariff: string; tariffUnit: string; tariffHint: string;
  type: string; types: Record<PlantType, string>;
  cost: string; costOptional: string; costPlaceholder: string; costHint: string; currency: string;
  resultTitle: string; chartLabel: string;
  legend: { surplus: string; grid: string; consumption: string };
  results: { year: string; coverage: string; savings: string; surplus: string; reserve: string; reserveOff: string; payback: string; paybackEmpty: string; years: string };
  advice: { fits: string; other: string; otherPage: string; otherCalculator: string; battery: string };
  cta: string; note: string;
  /** «≈ {hours} год». */
  hours: string;
  summary: { year: string; savings: string; payback: string; reserve: string };
  leadSummary: { monthly: string; cost: string; tariff: string };
  months: string[];
  units: { kWh: string; kW: string };
  kwUnitLabel: string;
};

type Props = {
  kw: number;
  segment: "home" | "business";
  consumption: { min: number; max: number; step: number; default: number };
  defaultRegionId: string;
  tariff: number;
  /** Standard plant sizes of the calculators (content/calculator.ts) — the size advice. */
  solarPlans: number[];
  /** Existing power pages: the advice links to one when it suggests another size. */
  powerPages: { kw: number; href: string }[];
  calculatorHref: string;
  /** Backup of the house load set with the ≈ 5 kWh battery (the same runtimeHours as the hub). */
  reserve: { hours: number; load: number; capacity: number };
  labels: PowerCalculatorLabels;
};

/** Animates a number to its new value in ≈ 300 ms (nothing with reduced motion). */
function useTween(value: number): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    // Reduced motion: the next frame shows the new value straight away.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const next = origin + (value - origin) * (1 - (1 - progress) ** 3);
      from.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return shown;
}

/** «01 · field · icon»: one numbered row of the form. */
function Step({ index, icon: Icon, children }: { index: number; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-t border-line pt-6 first:border-t-0 first:pt-0 sm:gap-4">
      <span aria-hidden className="mt-0.5 font-heading text-stat-sm font-light text-faint tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
      <span aria-hidden className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink sm:flex">
        <Icon className="size-4.5" strokeWidth={1.7} />
      </span>
    </div>
  );
}

function Result({ index, icon: Icon, value, label, dimmed = false }: { index: number; icon: LucideIcon; value: string; label: string; dimmed?: boolean }) {
  return (
    <div className="flex flex-col gap-2 rounded-tile border border-line-dark bg-fill-dark p-4">
      <div className="flex items-center justify-between gap-2 text-muted-dark">
        <span className="font-heading text-caption font-light tabular-nums">{String(index).padStart(2, "0")}</span>
        <Icon aria-hidden className="size-4" strokeWidth={1.7} />
      </div>
      <p className={`font-heading text-stat-sm font-medium tabular-nums ${dimmed ? "text-muted-dark" : "text-white"}`}>{value}</p>
      <p className="text-caption text-muted-dark">{label}</p>
    </div>
  );
}

/**
 * The calculator of a power page: the plant size is fixed by the page, the
 * visitor picks the region, consumption, tariff, plant type and (optionally)
 * the cost. Generation, savings (energy used on site × tariff) and payback use
 * the same data and rules as the payback calculator; the size advice is the
 * calculators' pickSolarPlan. «Get a quote» attaches the changed fields only.
 */
export function PowerCalculator({ kw, segment, consumption, defaultRegionId, tariff: defaultTariff, solarPlans, powerPages, calculatorHref, reserve, labels }: Props) {
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);
  const [regionId, setRegionId] = useState(defaultRegionId);
  const [monthlyKwh, setMonthlyKwh] = useState(consumption.default);
  const [tariff, setTariff] = useState(defaultTariff);
  const [plantType, setPlantType] = useState<PlantType>("battery");
  const [cost, setCost] = useState(0);
  const [changed, setChanged] = useState<Set<Field>>(new Set());
  const [regionFromUrl, setRegionFromUrl] = useState(false);

  // ?region=lvivska preselects the region (the calculator writes nothing to the URL).
  // After hydration: the server renders the default region. Counts as chosen.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("region");
    if (!id || !insolationRegions.some((region) => region.id === id)) return;
    const timer = window.setTimeout(() => {
      setRegionId(id);
      setRegionFromUrl(true);
      setChanged((current) => new Set(current).add("regionId"));
    });
    return () => window.clearTimeout(timer);
  }, []);

  function update(field: Field, apply: () => void) {
    apply();
    setChanged((current) => (current.has(field) ? current : new Set(current).add(field)));
  }

  const region = insolationRegions.find((item) => item.id === regionId) ?? insolationRegions[0];
  const months = stationMonths(region.yield, monthlyShare, kw);
  const estimate = fixedPlantEstimate({ months, monthlyKwh, tariff, cost: cost || undefined });
  const plan = pickSolarPlan(monthlyKwh, region.yield, solarPlans);
  const otherPage = powerPages.find((page) => page.kw === plan.kw);
  const withBattery = plantType === "battery";
  const paybackYears = estimate.paybackYears === null ? null : Math.round(estimate.paybackYears * 10) / 10;

  const year = useTween(estimate.year);
  const coverage = useTween(estimate.coverage);
  const savings = useTween(estimate.savings);
  const surplus = useTween(estimate.surplus);

  const objectType: CalculatorObjectType = segment === "business" ? "business" : "house";
  const values: [Field, CalculatorValue | undefined][] = [
    ["regionId", regionId],
    ["monthlyKwh", monthlyKwh],
    ["tariff", tariff || undefined],
    ["plantType", plantType],
    ["cost", cost || undefined],
  ];
  const data = buildCalculatorLeadData({
    calculator: "ses-power",
    values,
    applicable: () => true,
    changed,
    sources: regionFromUrl ? { regionId: "url" } : undefined,
    recommendation: {
      kw,
      plantType,
      generationYearKwh: roundYear(estimate.year),
      coveragePercent: Math.round(estimate.coverage),
      savingsYearUah: Math.round(estimate.savings / 100) * 100,
      surplusYearKwh: roundYear(estimate.surplus),
      paybackYears: paybackYears ?? undefined,
      backupHours: withBattery ? reserve.hours : undefined,
      suggestedKw: plan.kw,
    },
  });

  function summary(): string {
    const label = (field: Field): string => {
      switch (field) {
        case "regionId":
          return region.name[locale];
        case "monthlyKwh":
          return format(labels.leadSummary.monthly, { kwh: n(monthlyKwh) });
        case "tariff":
          return format(labels.leadSummary.tariff, { tariff: n(tariff) });
        case "plantType":
          return labels.types[plantType];
        case "cost":
          return format(labels.leadSummary.cost, { cost: n(cost) });
      }
    };
    const chosen = values.filter(([field, value]) => changed.has(field) && value !== undefined).map(([field]) => label(field));
    return `${chosen.join(" · ")} → ${n(kw)} ${labels.units.kW} · ${labels.types[plantType]}`;
  }

  const attach = useLeadAttachment(
    data ? { resultObjectType: objectType, summary: summary(), data } : null,
    () => {
      setChanged(new Set());
      setRegionFromUrl(false);
    },
  );

  function handoff() {
    const interacted = attach();
    trackEvent({ event: "calculator_cta_click", calculator: "ses-power", kw, region: regionId, interacted });
    goToLeadForm(anchors.contacts);
  }

  const spoken = buildCalculatorSummary([
    format(labels.summary.year, { kw: n(kw), locative: region.locative[locale], year: n(roundYear(estimate.year)) }),
    estimate.savings > 0 && format(labels.summary.savings, { savings: n(Math.round(estimate.savings / 100) * 100) }),
    paybackYears !== null && format(labels.summary.payback, { years: n(paybackYears) }),
    withBattery && format(labels.summary.reserve, { hours: n(reserve.hours) }),
  ]);

  // Chart: generation bars split at the consumption line, the line dashed.
  const scale = Math.max(...months, monthlyKwh) * 1.1 || 1;
  const segment3 = (from: number, size: number, className: string) => (
    <span
      className={`absolute inset-x-0 bottom-0 h-full origin-bottom transition-transform duration-300 ease-tech ${className}`}
      style={{ transform: `translateY(${(-from / scale) * 100}%) scaleY(${size / scale})` } as CSSProperties}
    />
  );

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      <form className="flex min-w-0 flex-col gap-6 rounded-card bg-white p-card-sm shadow-card lg:col-span-5 lg:p-card" onSubmit={(event) => event.preventDefault()}>
        <Step index={1} icon={MapPin}>
          <SelectField
            label={labels.region}
            hint={labels.regionHint}
            name="regionId"
            value={regionId}
            options={regionsByLocale(locale).map((item) => ({ value: item.id, label: item.name[locale] }))}
            onChange={(value) => update("regionId", () => setRegionId(value))}
          />
        </Step>
        <Step index={2} icon={Gauge}>
          <RangeField
            label={labels.consumption}
            hint={labels.consumptionHint}
            name="monthlyKwh"
            value={monthlyKwh}
            min={consumption.min}
            max={consumption.max}
            step={consumption.step}
            unit={labels.units.kWh}
            maxLabel={n(consumption.max)}
            onChange={(value) => update("monthlyKwh", () => setMonthlyKwh(value))}
          />
        </Step>
        <Step index={3} icon={Receipt}>
          <NumberField
            label={labels.tariff}
            hint={labels.tariffHint}
            name="tariff"
            value={tariff}
            min={0}
            step={0.01}
            unit={labels.tariffUnit}
            onChange={(value) => update("tariff", () => setTariff(value))}
          />
        </Step>
        <Step index={4} icon={Zap}>
          <RadioPills
            legend={labels.type}
            name="plantType"
            value={plantType}
            options={(["grid", "hybrid", "battery"] as const).map((value) => ({ value, label: labels.types[value] }))}
            onChange={(value) => update("plantType", () => setPlantType(value as PlantType))}
          />
        </Step>
        <Step index={5} icon={Wallet}>
          <NumberField
            label={`${labels.cost} (${labels.costOptional})`}
            hint={labels.costHint}
            name="cost"
            value={cost}
            min={0}
            step={1000}
            unit={labels.currency}
            placeholder={labels.costPlaceholder}
            onChange={(value) => update("cost", () => setCost(value))}
          />
        </Step>
      </form>

      <div className="flex min-w-0 flex-col gap-6 rounded-card bg-ink-glow p-card-sm text-white lg:sticky lg:top-28 lg:col-span-7 lg:p-card">
        <p className="font-heading text-h3-sm font-semibold sm:text-h3">{labels.resultTitle}</p>

        <figure className="flex flex-col gap-3">
          <div role="img" aria-label={format(labels.chartLabel, { kw: n(kw) })} className="flex h-40 items-end gap-1 border-b border-line-dark sm:h-48 sm:gap-1.5">
            {months.map((value, index) => {
              const self = Math.min(value, monthlyKwh);
              return (
                <div key={labels.months[index]} className="relative h-full min-w-0 flex-1">
                  {segment3(0, self, "bg-scale-3")}
                  {value > monthlyKwh ? segment3(self, value - monthlyKwh, "bg-accent") : segment3(self, monthlyKwh - value, "bg-line-dark")}
                  {/* The consumption line: a dashed top border moved to the monthly value. */}
                  <span
                    className="absolute inset-x-0 bottom-0 h-full border-t-2 border-dashed border-white transition-transform duration-300 ease-tech"
                    style={{ transform: `translateY(${(1 - monthlyKwh / scale) * 100}%)` } as CSSProperties}
                  />
                </div>
              );
            })}
          </div>
          <div aria-hidden className="flex gap-1 sm:gap-1.5">
            {labels.months.map((name) => (
              <span key={name} className="min-w-0 flex-1 text-center text-caption text-muted-dark">
                <span className="sm:hidden">{name.charAt(0)}</span>
                <span className="hidden sm:inline">{name}</span>
              </span>
            ))}
          </div>
          <figcaption className="flex flex-wrap gap-x-5 gap-y-2 text-caption text-muted-dark">
            <span className="flex items-center gap-2"><span aria-hidden className="size-3 rounded-sm bg-accent" />{labels.legend.surplus}</span>
            <span className="flex items-center gap-2"><span aria-hidden className="size-3 rounded-sm bg-line-dark" />{labels.legend.grid}</span>
            <span className="flex items-center gap-2"><span aria-hidden className="w-4 border-t-2 border-dashed border-white" />{labels.legend.consumption}</span>
          </figcaption>
        </figure>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Result index={1} icon={Sun} value={`≈ ${n(roundYear(year))} ${labels.units.kWh}`} label={format(labels.results.year, { kw: n(kw), locative: region.locative[locale] })} />
          <Result index={2} icon={Percent} value={`≈ ${n(Math.round(coverage))} %`} label={labels.results.coverage} />
          <Result index={3} icon={Wallet} value={`≈ ${n(Math.round(savings / 100) * 100)} ${labels.currency}`} label={labels.results.savings} />
          <Result index={4} icon={PlugZap} value={`≈ ${n(roundYear(surplus))} ${labels.units.kWh}`} label={labels.results.surplus} />
          <Result
            index={5}
            icon={BatteryCharging}
            value={withBattery ? format(labels.hours, { hours: n(reserve.hours) }) : "—"}
            label={withBattery ? format(labels.results.reserve, { load: n(reserve.load), capacity: n(reserve.capacity) }) : labels.results.reserveOff}
            dimmed={!withBattery}
          />
          <Result
            index={6}
            icon={CalendarClock}
            value={paybackYears === null ? "—" : `≈ ${n(paybackYears)} ${labels.results.years}`}
            label={paybackYears === null ? labels.results.paybackEmpty : labels.results.payback}
            dimmed={paybackYears === null}
          />
        </div>

        <div className="flex flex-col gap-2 text-small text-muted-dark">
          {plan.kw === kw ? (
            <p>{format(labels.advice.fits, { kwh: n(monthlyKwh), kw: n(kw) })}</p>
          ) : (
            <p>
              {format(labels.advice.other, { kwh: n(monthlyKwh), kw: n(plan.kw) })}{" "}
              <ArrowLink tone="dark" wrap href={otherPage ? otherPage.href : calculatorHref} className="text-small">
                {otherPage ? format(labels.advice.otherPage, { kw: n(plan.kw) }) : labels.advice.otherCalculator}
              </ArrowLink>
            </p>
          )}
          {withBattery ? null : <p>{labels.advice.battery}</p>}
        </div>

        <Button type="button" variant="primary" fullWidth onClick={handoff} icon={<ArrowUpRight aria-hidden className="size-4.5" />}>
          {labels.cta}
        </Button>
        <p className="text-caption text-muted-dark">{labels.note}</p>
        <ResultSummary text={spoken} />
      </div>
    </div>
  );
}
