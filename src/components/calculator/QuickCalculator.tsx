"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  type CSSProperties,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { IconButton } from "@/components/ui/icon-button";
import { inputClasses } from "@/components/ui/input-styles";
import { PillRadio } from "@/components/ui/pill-radio";
import {
  allowedGoals,
  backupHoursRange,
  batteryCandidates,
  calculatorDefaults,
  calculatorGoals,
  calculatorSegments,
  consumptionRange,
  criticalLoadShare,
  regions,
  solarPlans,
  solutionLinks,
  type CalculatorGoal,
  type CalculatorSegment,
} from "@/content/calculator";
import { products, productSummary, type ProductId } from "@/content/products";
import { anchors } from "@/content/routes";
import { services } from "@/content/services";
import { trackEvent } from "@/lib/analytics";
import {
  calculate,
  roundToHundreds,
  type Recommendation,
} from "@/lib/calculator";
import { applyCalculatorToLeadForm } from "@/lib/calculator-bridge";
import { formatNumber } from "@/lib/format";
import { useLocale, useMessages } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { format } from "@/lib/messages";
import { localizePath } from "@/i18n/config";

type CalculatorMessages = Messages["calculator"];
type Units = Messages["units"];

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Right end label, e.g. «1 200+». */
  maxLabel: string;
  hint?: string;
  onChange: (value: number) => void;
};

/** Native range input: arrow keys, Home/End and PageUp/PageDown work out of the box. */
function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit,
  maxLabel,
  hint,
  onChange,
}: RangeFieldProps) {
  const locale = useLocale();
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <p aria-hidden className="flex items-baseline gap-2 text-ink">
        <span className="font-heading text-number-sm font-medium tabular-nums">
          {formatNumber(value, locale)}
        </span>
        <span className="text-sm text-ink/70">{unit}</span>
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${formatNumber(value, locale)} ${unit}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-input"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      <div
        aria-hidden
        className="flex justify-between text-sm text-ink/70 tabular-nums"
      >
        <span>{formatNumber(min, locale)}</span>
        <span>{maxLabel}</span>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function batteryName(
  rec: Recommendation,
  t: CalculatorMessages,
): string | undefined {
  if (!rec.battery) return undefined;
  const name = products[rec.battery.id as ProductId].name;

  return rec.battery.modules > 1
    ? format(t.result.modules, { count: String(rec.battery.modules), name })
    : name;
}

function configuration(
  rec: Recommendation,
  t: CalculatorMessages,
  units: Units,
  locale: Locale,
): string {
  const parts: string[] = [];
  if (rec.solarKw !== undefined) {
    parts.push(
      format(t.result.configSolar, {
        power: `${formatNumber(rec.solarKw, locale)} ${units.kW}`,
      }),
    );
  }
  const battery = batteryName(rec, t);
  if (battery) parts.push(format(t.result.configBattery, { battery }));

  const text = parts.join(t.result.configJoin);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ResultLink({
  href,
  title,
  text,
  kind,
}: {
  href: string;
  title: string;
  text: string;
  kind: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-t border-white/16 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-base font-medium text-white">{title}</span>
        <span className="text-sm text-white/75">{text}</span>
      </span>
      <span className="text-sm text-white/75">{kind}</span>
      <IconButton decorative variant="outline-dark" size="sm" />
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse gap-1 border-t border-white/16 pt-4">
      <dt className="text-sm text-white/75">{label}</dt>
      <dd className="font-heading text-stat-sm font-medium whitespace-nowrap tabular-nums sm:text-stat">
        {value}
      </dd>
    </div>
  );
}

function Group({
  legend,
  children,
  hint,
}: {
  legend: string;
  children: ReactNode;
  hint?: string;
}) {
  const hintId = useId();

  return (
    <fieldset
      className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
      aria-describedby={hint ? hintId : undefined}
    >
      <legend className="mb-3 text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {hint ? (
        <p id={hintId} className="text-sm text-ink/70">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

export function QuickCalculator() {
  const messages = useMessages();
  const locale = useLocale();
  const t = messages.calculator;
  const units = messages.units;
  const [segment, setSegment] = useState<CalculatorSegment>(
    calculatorDefaults.segment,
  );
  const [goal, setGoal] = useState<CalculatorGoal>(calculatorDefaults.goal);
  const [consumption, setConsumption] = useState(
    consumptionRange[calculatorDefaults.segment].default,
  );
  const [regionSlug, setRegionSlug] = useState(calculatorDefaults.region);
  const [hours, setHours] = useState(calculatorDefaults.hours);
  const interacted = useRef(false);
  const regionId = useId();

  const range = consumptionRange[segment];
  const region = regions.find((item) => item.slug === regionSlug) ?? regions[0];
  const needSolar = goal !== "reserve";
  const needBattery = goal !== "economy";

  const rec = calculate({
    monthlyKwh: consumption,
    specificYield: region.specificYield,
    solarPlans,
    backupHours: hours,
    criticalLoadShare: criticalLoadShare[segment],
    candidates: batteryCandidates(segment),
    needSolar,
    needBattery,
  });
  const config = configuration(rec, t, units, locale);
  const isCustom = rec.solarFits === false || rec.battery?.fits === false;
  const solution = needSolar ? solutionLinks[segment] : undefined;

  /** First change of any input → one analytics event. */
  function touched(next: { segment?: CalculatorSegment }) {
    if (interacted.current) return;
    interacted.current = true;
    trackEvent({
      event: "calculator_interaction",
      segment: next.segment ?? segment,
    });
  }

  function changeSegment(next: CalculatorSegment) {
    touched({ segment: next });
    setSegment(next);
    setConsumption(consumptionRange[next].default);
    if (!allowedGoals[next].includes(goal)) setGoal(allowedGoals[next][0]);
  }

  function handleCta() {
    const data = {
      segment,
      goal,
      monthlyKwh: consumption,
      region: needSolar ? region.slug : undefined,
      backupHours: needBattery ? hours : undefined,
      recommendation: {
        configuration: config,
        solarKw: rec.solarKw,
        annualGenerationKwh: rec.annualGenerationKwh
          ? roundToHundreds(rec.annualGenerationKwh)
          : undefined,
        battery: rec.battery
          ? {
              product: rec.battery.id,
              modules: rec.battery.modules,
              capacityKwh: rec.battery.capacityKwh,
            }
          : undefined,
        backupHours: rec.backupHours ? Math.round(rec.backupHours) : undefined,
        custom: isCustom,
      },
    };

    applyCalculatorToLeadForm({
      objectType: segment,
      summary: config,
      data: JSON.stringify(data),
    });
    trackEvent({
      event: "calculator_result_cta",
      segment,
      configuration: config,
    });

    const target = document.getElementById(anchors.contacts);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    target
      ?.querySelector<HTMLInputElement>('input[name="name"]')
      ?.focus({ preventScroll: true });
  }

  const stats: { value: string; label: string }[] = [];
  if (rec.solarKw !== undefined && rec.annualGenerationKwh !== undefined) {
    stats.push(
      {
        value: `${formatNumber(rec.solarKw, locale)} ${units.kW}`,
        label: t.result.solarPower,
      },
      {
        value: format(t.result.approx, {
          value: formatNumber(roundToHundreds(rec.annualGenerationKwh), locale),
        }),
        label: t.result.generation,
      },
    );
  }
  if (rec.battery && rec.backupHours !== undefined) {
    stats.push(
      {
        value: `${formatNumber(rec.battery.capacityKwh, locale)} ${units.kWh}`,
        label: t.result.capacity,
      },
      {
        value: format(t.result.approx, {
          value: format(t.result.hoursValue, {
            value: formatNumber(Math.round(rec.backupHours), locale),
          }),
        }),
        label: t.result.backup,
      },
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <form
        aria-label={t.formLabel}
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-8 rounded-3xl bg-white p-card-sm lg:col-span-7 lg:p-card"
      >
        <Group legend={t.segment}>
          {calculatorSegments.map((item) => (
            <PillRadio
              key={item}
              name="calculator-segment"
              value={item}
              checked={segment === item}
              onChange={() => changeSegment(item)}
            >
              {t.segments[item]}
            </PillRadio>
          ))}
        </Group>

        <Group
          legend={t.goal}
          hint={segment === "apartment" ? t.apartmentGoalHint : undefined}
        >
          {calculatorGoals.map((item) => (
            <PillRadio
              key={item}
              name="calculator-goal"
              value={item}
              checked={goal === item}
              disabled={!allowedGoals[segment].includes(item)}
              onChange={() => {
                touched({});
                setGoal(item);
              }}
            >
              {t.goals[item]}
            </PillRadio>
          ))}
        </Group>

        <RangeField
          label={t.consumption}
          value={consumption}
          min={range.min}
          max={range.max}
          step={range.step}
          unit={units.kWh}
          maxLabel={format(t.maxPlus, {
            value: formatNumber(range.max, locale),
          })}
          hint={t.consumptionHint}
          onChange={(value) => {
            touched({});
            setConsumption(value);
          }}
        />

        {needSolar ? (
          <div className="flex flex-col gap-3">
            <label htmlFor={regionId} className="text-sm font-medium text-ink">
              {t.region}
            </label>
            <div className="relative">
              <select
                id={regionId}
                value={region.slug}
                aria-describedby={`${regionId}-hint`}
                onChange={(event) => {
                  touched({});
                  setRegionSlug(event.target.value);
                }}
                className={`${inputClasses({})} cursor-pointer appearance-none pr-12`}
              >
                {regions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name[locale]}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink/70"
              />
            </div>
            <p id={`${regionId}-hint`} className="text-sm text-ink/70">
              {t.regionHint}
            </p>
          </div>
        ) : null}

        {needBattery ? (
          <RangeField
            label={t.hours}
            value={hours}
            min={backupHoursRange.min}
            max={backupHoursRange.max}
            step={backupHoursRange.step}
            unit={t.hoursUnit}
            maxLabel={formatNumber(backupHoursRange.max, locale)}
            onChange={(value) => {
              touched({});
              setHours(value);
            }}
          />
        ) : null}
      </form>

      <div className="flex flex-col gap-8 rounded-3xl bg-ink p-card-sm text-white lg:col-span-5 lg:p-card">
        <div aria-live="polite" className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <CardLabel tone="dark">{t.result.eyebrow}</CardLabel>
            <span className="text-sm text-white/75">
              {t.result.approximate}
            </span>
          </div>

          <p className="font-heading text-h3-sm font-medium tracking-tight sm:text-h3">
            {config}
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </dl>

          {isCustom ? (
            <p className="text-sm text-white/75">{t.result.custom}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          {rec.battery ? (
            <ResultLink
              href={localizePath(products[rec.battery.id as ProductId].href, locale)}
              title={products[rec.battery.id as ProductId].name}
              text={productSummary(rec.battery.id as ProductId, locale)}
              kind={t.result.product}
            />
          ) : null}
          {solution ? (
            <ResultLink
              href={localizePath(solution.href, locale)}
              title={services[solution.serviceKey].name[locale]}
              text={services[solution.serviceKey].summary[locale]}
              kind={t.result.solution}
            />
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <Button
            type="button"
            onClick={handleCta}
            icon={<ArrowUpRight aria-hidden className="size-4.5" />}
            className="w-full"
          >
            {t.result.cta}
          </Button>
          <p className="text-sm text-white/75">{t.result.note}</p>
        </div>
      </div>
    </div>
  );
}
