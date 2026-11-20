"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Group, RangeField, SelectField } from "@/components/calculator/calculator-fields";
import { ResultLink, Stat } from "@/components/calculator/calculator-result-parts";
import { useLeadAttachment } from "@/components/calculator/use-lead-attachment";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { PillRadio } from "@/components/ui/form/pill-radio";
import {
  allowedGoals,
  backupHoursRange,
  batteryCandidates,
  calculatorDefaults,
  calculatorGoals,
  calculatorSegments,
  consumptionRange,
  criticalLoadShare,
  solarPlans,
  solutionLink,
  type CalculatorGoal,
  type CalculatorSegment,
} from "@/content/calculator";
import { insolationRegions, regionsByLocale } from "@/content/insolation";
import { products, productSummary, type ProductId } from "@/content/products";
import { anchors } from "@/content/routes";
import { services } from "@/content/services";
import { trackEvent } from "@/lib/analytics";
import {
  calculate,
  roundToHundreds,
  type Recommendation,
} from "@/lib/calculator";
import { goToLeadForm } from "@/lib/calculator-bridge";
import { buildCalculatorLeadData } from "@/lib/calculator-lead";
import { formatNumber } from "@/lib/format";
import { useLocale, useMessages } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { format } from "@/lib/messages";
import { localizePath } from "@/i18n/config";

type CalculatorMessages = Messages["calculator"];
type Units = Messages["units"];

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

/** Inputs in display order; these names are the keys of `calculatorData`. */
type QuickField = "segment" | "goal" | "monthlyKwh" | "region" | "backupHours";

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
  const [regionId, setRegionId] = useState(calculatorDefaults.region);
  const [hours, setHours] = useState(calculatorDefaults.hours);
  // Fields the visitor touched; only these count as chosen for the lead.
  const [changed, setChanged] = useState<ReadonlySet<QuickField>>(new Set());

  const range = consumptionRange[segment];
  const region = insolationRegions.find((item) => item.id === regionId) ?? insolationRegions[0];
  const needSolar = goal !== "reserve";
  const needBattery = goal !== "economy";

  const rec = calculate({
    monthlyKwh: consumption,
    specificYield: region.yield,
    solarPlans,
    backupHours: hours,
    criticalLoadShare: criticalLoadShare[segment],
    candidates: batteryCandidates(segment),
    needSolar,
    needBattery,
  });
  const config = configuration(rec, t, units, locale);
  const isCustom = rec.solarFits === false || rec.battery?.fits === false;
  const solution = solutionLink(goal);

  /** Marks `field` as chosen; `reset` fields went back to defaults on their own. */
  function touch(
    field: QuickField,
    reset: QuickField[] = [],
    nextSegment: CalculatorSegment = segment,
  ) {
    // First change of any input → one analytics event.
    if (changed.size === 0) {
      trackEvent({ event: "calculator_interaction", segment: nextSegment });
    }
    setChanged((current) => {
      const next = new Set(current);
      reset.forEach((item) => next.delete(item));
      next.add(field);
      return next;
    });
  }

  function changeSegment(next: CalculatorSegment) {
    const goalAllowed = allowedGoals[next].includes(goal);
    // The consumption (and a goal the segment does not offer) jump to defaults.
    touch("segment", goalAllowed ? ["monthlyKwh"] : ["monthlyKwh", "goal"], next);
    setSegment(next);
    setConsumption(consumptionRange[next].default);
    if (!goalAllowed) setGoal(allowedGoals[next][0]);
  }

  const values: [QuickField, string | number][] = [
    ["segment", segment],
    ["goal", goal],
    ["monthlyKwh", consumption],
    ["region", region.id],
    ["backupHours", hours],
  ];
  const applicable = (field: string) =>
    (field !== "region" || needSolar) && (field !== "backupHours" || needBattery);

  const data = buildCalculatorLeadData({
    calculator: "quick",
    values,
    applicable,
    changed,
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
  });

  /** «Квартира · 260 кВт·год/міс. → SVIT HOME»: chosen fields and the recommendation only. */
  function summary(): string {
    const parts = values
      .filter(([field]) => changed.has(field) && applicable(field))
      .map(([field]) => {
        switch (field) {
          case "segment":
            return t.segments[segment];
          case "goal":
            return t.goals[goal];
          case "monthlyKwh":
            return format(t.summaryKwh, { value: formatNumber(consumption, locale) });
          case "region":
            return region.name[locale];
          case "backupHours":
            return format(t.result.hoursValue, { value: formatNumber(hours, locale) });
        }
      });
    return `${parts.join(" · ")} → ${config}`;
  }

  const attach = useLeadAttachment(
    data
      ? {
          objectType: changed.has("segment") ? segment : undefined,
          resultObjectType: segment,
          summary: summary(),
          data,
        }
      : null,
    () => setChanged(new Set()),
  );

  function handleCta() {
    const interacted = attach();
    trackEvent({
      event: "calculator_result_cta",
      segment,
      configuration: config,
      interacted,
    });
    goToLeadForm(anchors.contacts);
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
        className="flex flex-col gap-8 rounded-card bg-white p-card-sm lg:col-span-7 lg:p-card"
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
                touch("goal");
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
            touch("monthlyKwh");
            setConsumption(value);
          }}
        />

        {needSolar ? (
          <SelectField
            label={t.region}
            value={region.id}
            hint={t.regionHint}
            options={regionsByLocale(locale).map((item) => ({
              value: item.id,
              label: item.name[locale],
            }))}
            onChange={(value) => {
              touch("region");
              setRegionId(value);
            }}
          />
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
              touch("backupHours");
              setHours(value);
            }}
          />
        ) : null}
      </form>

      <div className="flex flex-col gap-8 rounded-card bg-ink-glow p-card-sm text-white lg:col-span-5 lg:p-card">
        <div aria-live="polite" className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <CardLabel tone="dark">{t.result.eyebrow}</CardLabel>
            <span className="text-small text-muted-dark">
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
            <p className="text-small text-muted-dark">{t.result.custom}</p>
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
          <ResultLink
            href={localizePath(solution.href, locale)}
            title={services[solution.serviceKey].name[locale]}
            text={services[solution.serviceKey].summary[locale]}
            kind={t.result.solution}
          />
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
          <p className="text-small text-muted-dark">{t.result.note}</p>
        </div>
      </div>
    </div>
  );
}
