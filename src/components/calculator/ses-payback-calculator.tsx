"use client";

import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { CheckChip } from "@/components/ui/form/check-chip";
import { useEffect, type ReactNode } from "react";

import { Group, NumberField, RangeField, SelectField } from "@/components/calculator/calculator-fields";
import { ProductLink, Stat } from "@/components/calculator/calculator-result-parts";
import { useSesPayback, type SesField } from "@/components/calculator/ses-payback-state";
import { ResultSummary } from "@/components/calculator/result-summary";
import { useLeadAttachment } from "@/components/calculator/use-lead-attachment";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { PillRadio } from "@/components/ui/form/pill-radio";
import { appliances } from "@/content/appliances";
import { insolationRegions, regionPath, regionsByLocale } from "@/content/insolation";
import { products } from "@/content/products";
import { anchors } from "@/content/routes";
import { sesCalculatorConfig, type SesGoal, type SesObjectType, type SesPlacement } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { useLocale, useMessages } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { trackEvent } from "@/lib/analytics";
import { goToLeadForm } from "@/lib/calculator-bridge";
import { buildCalculatorLeadData, type CalculatorValue } from "@/lib/calculator-lead";
import { buildCalculatorSummary } from "@/lib/calculator-summary";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const objectTypes: SesObjectType[] = ["apartment", "house", "business"];
const goals: SesGoal[] = ["savings", "backup", "both"];
const placements: SesPlacement[] = ["roof-south", "roof-east-west", "ground"];

/** Rounds big estimates so they do not look more precise than they are. */
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

let lastChangeAt = 0;

/** Sends «calculator_change» at most every 350 ms (sliders fire on every step). */
function trackChange(field: string) {
  const now = Date.now();
  if (now - lastChangeAt < 350) return;
  lastChangeAt = now;
  trackEvent({ event: "calculator_change", field });
}

/** One numbered block of the form: fieldset with «01 · Title» as its legend. */
function Step({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-6 border-0 border-t border-line p-0 pt-8 first:border-t-0 first:pt-0">
      <legend className="float-left mb-2 flex w-full items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line font-heading text-small font-medium text-ink tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-heading text-h3-sm font-medium tracking-tight text-ink sm:text-h3">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

/**
 * SES payback calculator: the form (7 columns) and a sticky dark result card
 * (5 columns) that updates as the user types. On phones the result follows
 * the form. «Get a quote» attaches the fields the visitor chose (and keeps
 * them in sync) to the lead form below; untouched defaults are not attached.
 */
export function SesPaybackCalculator() {
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.sesPayback;
  const { state, update, changed, sources, resetChanged, result } = useSesPayback();
  const region = insolationRegions.find((item) => item.id === state.regionId) ?? insolationRegions[0];
  const kwh = t.kwh;
  const pathname = usePathname();
  // Region page of the chosen region; hidden on that page itself.
  const regionHref = localizePath(regionPath(region), locale);
  let stepIndex = 0;

  useEffect(() => {
    trackEvent({ event: "calculator_start" });
  }, []);

  useEffect(() => {
    trackEvent({ event: "calculator_result_view", kw: result.kw, product: result.battery?.id ?? "none", region: state.regionId });
  }, [result.kw, result.battery?.id, state.regionId]);

  function batteryName() {
    if (!result.battery) return undefined;
    return result.battery.modules > 1 ? `${result.battery.name} × ${result.battery.modules}` : result.battery.name;
  }

  const usesBill = state.monthlyBill > 0;
  const backup = state.goal !== "savings";
  /** Inputs in display order; `undefined` = optional field left empty. */
  const values: [SesField, CalculatorValue | undefined][] = [
    ["objectType", state.objectType],
    ["goal", state.goal],
    ["monthlyKwh", state.monthlyKwh],
    ["monthlyBill", state.monthlyBill || undefined],
    ["tariff", state.tariff || undefined],
    ["regionId", state.regionId],
    ["placement", state.placement],
    ["roofArea", state.roofArea || undefined],
    ["backupLoads", state.backupLoads],
    ["backupHours", state.backupHours],
    ["budget", state.budget || undefined],
  ];
  const applicable = (field: string) => {
    if (field === "monthlyKwh") return !usesBill;
    if (field === "monthlyBill") return usesBill;
    if (field === "backupLoads" || field === "backupHours") return backup;
    return true;
  };

  const data = buildCalculatorLeadData({
    calculator: "ses-payback",
    values,
    applicable,
    changed,
    sources,
    recommendation: {
      monthlyKwh: Math.round(result.monthlyKwh),
      kw: result.kw,
      plantType: result.plantType,
      limitedByRoof: result.limitedByRoof,
      generationYearKwh: roundTo(result.generationYear, 10),
      savingsYearUah: roundTo(result.savingsYear, 100),
      paybackYears: result.paybackYears ? Math.round(result.paybackYears * 10) / 10 : undefined,
      battery: result.battery
        ? {
            product: result.battery.id,
            modules: result.battery.modules,
            capacityKwh: result.battery.capacityKwh,
            backupHours: Math.round(result.battery.backupHours * 10) / 10,
            separateInverter: result.battery.inverterNote,
          }
        : undefined,
    },
  });

  /** Chosen fields and the recommendation only, e.g. «Квартира · 260 кВт·год/міс. → 2 кВт · SVIT HOME». */
  function summary(): string {
    const label = (field: SesField): string => {
      switch (field) {
        case "objectType":
          return t.objects[state.objectType];
        case "goal":
          return t.goals[state.goal];
        case "monthlyKwh":
          return `${formatNumber(state.monthlyKwh, locale)} ${kwh}/${t.monthUnit}`;
        case "monthlyBill":
          return `${formatNumber(state.monthlyBill, locale)} ${t.uah}`;
        case "tariff":
          return `${formatNumber(state.tariff, locale)} ${t.tariffUnit}`;
        case "regionId":
          return region.name[locale];
        case "placement":
          return t.placements[state.placement];
        case "roofArea":
          return `${formatNumber(state.roofArea, locale)} ${t.m2}`;
        case "backupLoads":
          return appliances
            .filter((item) => state.backupLoads.includes(item.id))
            .map((item) => item.name[locale])
            .join(", ");
        case "backupHours":
          return `${state.backupHours} ${t.hoursUnit}`;
        case "budget":
          return `${formatNumber(state.budget, locale)} ${t.uah}`;
      }
    };
    const chosen = values
      .filter(([field, value]) => changed.has(field) && applicable(field) && value !== undefined)
      .map(([field]) => label(field))
      .filter(Boolean);
    const recommendation = [`${formatNumber(result.kw, locale)} ${t.kwUnit}`, batteryName()].filter(Boolean);
    return `${chosen.join(" · ")} → ${recommendation.join(" · ")}`;
  }

  const attach = useLeadAttachment(
    data
      ? {
          objectType: changed.has("objectType") ? state.objectType : undefined,
          resultObjectType: state.objectType,
          summary: summary(),
          data,
        }
      : null,
    resetChanged,
  );

  function handoff() {
    const interacted = attach();
    trackEvent({ event: "calculator_cta_click", kw: result.kw, product: result.battery?.id ?? "none", region: state.regionId, interacted });
    goToLeadForm(anchors.contacts);
  }

  const summaryBattery = batteryName();
  const spokenSummary = buildCalculatorSummary([
    result.kw > 0 && format(t.summary.solar, { kw: formatNumber(result.kw, locale) }),
    result.paybackYears ? format(t.summary.payback, { years: formatNumber(Math.round(result.paybackYears * 10) / 10, locale) }) : undefined,
    summaryBattery && format(t.summary.battery, { product: summaryBattery }),
  ]);

  const payback = result.paybackYears
    ? `${formatNumber(Math.round(result.paybackYears * 10) / 10, locale)} ${t.year}`
    : undefined;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      <form
        className="flex min-w-0 flex-col gap-8 rounded-card border border-line bg-white p-card-sm shadow-card lg:col-span-7 lg:p-card"
        onSubmit={(event) => event.preventDefault()}
      >
        <Step index={++stepIndex} title={t.steps[0]}>
          <Group legend={t.objectType}>
            {objectTypes.map((option) => (
              <PillRadio
                key={option}
                name="objectType"
                value={option}
                checked={state.objectType === option}
                onChange={() => {
                  trackChange("objectType");
                  // Business has no regulated tariff: the user enters their own price.
                  const tariff = option === "business" ? 0 : state.tariff || householdTariff.value;
                  update(
                    { objectType: option, tariff },
                    { chosen: ["objectType"], reset: tariff !== state.tariff ? ["tariff"] : [] },
                  );
                }}
              >
                {t.objects[option]}
              </PillRadio>
            ))}
          </Group>
          <Group legend={t.goal}>
            {goals.map((option) => (
              <PillRadio
                key={option}
                name="goal"
                value={option}
                checked={state.goal === option}
                onChange={() => {
                  trackChange("goal");
                  update({ goal: option });
                }}
              >
                {t.goals[option]}
              </PillRadio>
            ))}
          </Group>
        </Step>

        <Step index={++stepIndex} title={t.steps[1]}>
          <RangeField
            name="monthlyKwh"
            label={t.consumption}
            value={result.monthlyKwh}
            min={sesCalculatorConfig.consumption.min}
            max={sesCalculatorConfig.consumption.max}
            step={sesCalculatorConfig.consumption.step}
            unit={kwh}
            maxLabel={format(t.maxPlus, { value: formatNumber(sesCalculatorConfig.consumption.max, locale) })}
            onChange={(value) => {
              trackChange("monthlyKwh");
              update({ monthlyKwh: value, monthlyBill: 0 }, { chosen: ["monthlyKwh"], reset: ["monthlyBill"] });
            }}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
            <NumberField
              name="tariff"
              label={t.tariff}
              value={state.tariff}
              min={0.01}
              step={0.01}
              unit={t.tariffUnit}
              required={state.objectType === "business"}
              hint={state.objectType === "business" ? t.businessTariff : `${t.tariffValid} ${t.heatingHint}`}
              onChange={(value) => {
                trackChange("tariff");
                update({ tariff: value });
              }}
            />
            <NumberField
              name="monthlyBill"
              label={t.monthlyBill}
              value={state.monthlyBill}
              min={0}
              step={100}
              unit={t.uah}
              placeholder={t.billPlaceholder}
              hint={t.monthlyBillHint}
              onChange={(value) => {
                trackChange("monthlyBill");
                update({ monthlyBill: value });
              }}
            />
          </div>
        </Step>

        <Step index={++stepIndex} title={t.steps[2]}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
            <SelectField
              name="region"
              label={t.region}
              value={state.regionId}
              options={regionsByLocale(locale).map((item) => ({ value: item.id, label: item.name[locale] }))}
              onChange={(value) => {
                trackChange("region");
                update({ regionId: value });
              }}
            />
            <SelectField
              name="placement"
              label={t.placement}
              value={state.placement}
              options={placements.map((item) => ({ value: item, label: t.placements[item] }))}
              onChange={(value) => {
                trackChange("placement");
                update({ placement: value as SesPlacement });
              }}
            />
          </div>
          {pathname !== regionHref ? (
            <ArrowLink href={regionHref} wrap className="self-start text-small">
              {format(t.regionPageLink, { locative: region.locative[locale] })}
            </ArrowLink>
          ) : null}
          <NumberField
            name="roofArea"
            label={t.roofArea}
            value={state.roofArea}
            min={1}
            step={1}
            unit={t.m2}
            placeholder={t.roofPlaceholder}
            onChange={(value) => {
              trackChange("roofArea");
              update({ roofArea: value });
            }}
          />
          {result.limitedByRoof ? (
            <p role="status" className="rounded-tile bg-sky p-4 text-small text-ink">
              {t.roofLimit}
            </p>
          ) : null}
        </Step>

        {state.goal !== "savings" ? (
          <Step index={++stepIndex} title={t.steps[3]}>
            <Group legend={t.backupLoads}>
              {appliances.map((item) => {
                const checked = state.backupLoads.includes(item.id);
                return (
                  <CheckChip
                    key={item.id}
                    name="backupLoads"
                    value={item.id}
                    checked={checked}
                    onChange={() => {
                        trackChange("backupLoads");
                        update({
                          backupLoads: checked
                            ? state.backupLoads.filter((id) => id !== item.id)
                            : [...state.backupLoads, item.id],
                        });
                    }}
                  >
                    {item.name[locale]}
                  </CheckChip>
                );
              })}
            </Group>
            <RangeField
              name="backupHours"
              label={t.backupHours}
              value={state.backupHours}
              min={sesCalculatorConfig.backupHours.min}
              max={sesCalculatorConfig.backupHours.max}
              step={1}
              unit={t.hoursUnit}
              maxLabel={formatNumber(sesCalculatorConfig.backupHours.max, locale)}
              onChange={(value) => {
                trackChange("backupHours");
                update({ backupHours: value });
              }}
            />
          </Step>
        ) : null}

        <Step index={++stepIndex} title={t.steps[4]}>
          <NumberField
            name="budget"
            label={t.budget}
            value={state.budget}
            min={0}
            step={1000}
            unit={t.uah}
            placeholder={t.budgetPlaceholder}
            hint={t.budgetHint}
            onChange={(value) => {
              trackChange("budget");
              update({ budget: value });
            }}
          />
        </Step>
      </form>

      <div className="flex flex-col gap-8 rounded-card bg-ink-glow p-card-sm text-white lg:sticky lg:top-28 lg:col-span-5 lg:p-card">
        <ResultSummary text={spokenSummary} />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <CardLabel tone="dark">{t.recommendation}</CardLabel>
            <span className="inline-flex items-center gap-2 text-small text-muted-dark">
              <span aria-hidden className="size-2 rounded-full bg-accent motion-safe:animate-pulse" />
              {t.live}
            </span>
          </div>

          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-number-sm font-light tracking-tight tabular-nums lg:text-number">
              {formatNumber(result.kw, locale)} {t.kwUnit}
            </span>
            <span className="text-body text-muted-dark">{result.plantType === "grid" ? t.grid : t.hybrid}</span>
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Stat label={t.generation} value={`${t.approx} ${formatNumber(roundTo(result.generationYear, 10), locale)} ${kwh}`} />
            <Stat label={t.savings} value={`${t.approx} ${formatNumber(roundTo(result.savingsYear, 100), locale)} ₴`} />
            <Stat label={t.battery} value={result.battery ? `${formatNumber(result.battery.capacityKwh, locale)} ${kwh}` : "—"} />
            <Stat label={t.backup} value={result.battery ? `${formatNumber(Math.round(result.battery.backupHours * 10) / 10, locale)} ${t.hoursUnit}` : "—"} />
          </dl>

          <div className="flex items-center justify-between gap-4 rounded-tile border border-line-dark p-4">
            <span className="text-small text-muted-dark">{t.payback}</span>
            {payback ? (
              <span className="font-heading text-stat-sm font-medium tabular-nums sm:text-stat">{payback}</span>
            ) : (
              <span className="text-right text-small text-muted-dark">{t.enterBudget}</span>
            )}
          </div>

          {!result.battery && state.goal !== "savings" ? (
            <p className="text-small text-muted-dark">{t.noProduct}</p>
          ) : null}
        </div>

        {result.battery ? (
          <ProductLink
            href={localizePath(result.battery.href, locale)}
            image={products[result.battery.id].image}
            kind={messages.calculator.result.product}
            title={batteryName() as string}
            text={`${formatNumber(result.battery.capacityKwh, locale)} ${kwh}${result.battery.inverterNote ? ` ${t.hybridInverter}` : ""}`}
            label={format(t.productLink, { name: batteryName() as string })}
          />
        ) : null}

        <div className="mt-auto flex flex-col gap-4">
          <Button type="button" onClick={handoff} icon={<ArrowUpRight aria-hidden className="size-4.5" />} className="w-full">
            {t.quote}
          </Button>
          <p className="text-small text-muted-dark">
            {format(t.footnote, { tariff: formatNumber(state.tariff, locale), region: region.name[locale] })}
          </p>
        </div>
      </div>
    </div>
  );
}
