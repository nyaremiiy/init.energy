"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Group, NumberField, RangeField, SelectField } from "@/components/calculator/calculator-fields";
import { ProductLink, Stat } from "@/components/calculator/calculator-result-parts";
import { useSesPayback } from "@/components/calculator/ses-payback-state";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { chipClasses } from "@/components/ui/chip-styles";
import { PillRadio } from "@/components/ui/pill-radio";
import { appliances } from "@/content/appliances";
import { insolationRegions, regionsByLocale } from "@/content/insolation";
import { products } from "@/content/products";
import { anchors } from "@/content/routes";
import { sesCalculatorConfig, type SesGoal, type SesObjectType, type SesPlacement } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { useLocale, useMessages } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { trackEvent } from "@/lib/analytics";
import { applyCalculatorToLeadForm } from "@/lib/calculator-bridge";
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line font-heading text-sm font-medium text-ink tabular-nums">
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
 * the form. «Get a quote» hands every parameter to the lead form below.
 */
export function SesPaybackCalculator() {
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.sesPayback;
  const { state, update, input, result } = useSesPayback();
  const region = insolationRegions.find((item) => item.id === state.regionId) ?? insolationRegions[0];
  const kwh = t.kwh;
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

  function handoff() {
    const parts = [
      t.objects[state.objectType],
      `${formatNumber(result.monthlyKwh, locale)} ${kwh}/${t.monthUnit}`,
      region.name[locale],
      `${formatNumber(result.kw, locale)} ${t.kwUnit}`,
      ...(state.goal !== "savings" ? [`${state.backupHours} ${t.hoursUnit}`] : []),
      ...(batteryName() ? [batteryName() as string] : []),
    ];
    applyCalculatorToLeadForm({ objectType: state.objectType, summary: parts.join(" · "), data: JSON.stringify({ input, result }) });
    trackEvent({ event: "calculator_cta_click", kw: result.kw, product: result.battery?.id ?? "none", region: state.regionId });
    document.getElementById(anchors.contacts)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const payback = result.paybackYears
    ? `${formatNumber(Math.round(result.paybackYears * 10) / 10, locale)} ${t.year}`
    : undefined;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      <form
        className="flex min-w-0 flex-col gap-8 rounded-3xl border border-line bg-white p-card-sm shadow-card lg:col-span-7 lg:p-card"
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
                  update({
                    objectType: option,
                    tariff: option === "business" ? 0 : state.tariff || householdTariff.value,
                  });
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
              update({ monthlyKwh: value, monthlyBill: 0 });
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
            <p role="status" className="rounded-2xl bg-sky p-4 text-sm text-ink">
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
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="backupLoads"
                      value={item.id}
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => {
                        trackChange("backupLoads");
                        update({
                          backupLoads: checked
                            ? state.backupLoads.filter((id) => id !== item.id)
                            : [...state.backupLoads, item.id],
                        });
                      }}
                    />
                    <span className={`gap-2 peer-focus-visible:ring-3 peer-focus-visible:ring-ink/15 ${chipClasses({ selected: checked })}`}>
                      {checked ? <Check aria-hidden className="size-4" /> : null}
                      {item.name[locale]}
                    </span>
                  </label>
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

      <div className="flex flex-col gap-8 rounded-3xl bg-ink p-card-sm text-white lg:sticky lg:top-28 lg:col-span-5 lg:p-card">
        <div aria-live="polite" className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <CardLabel tone="dark">{t.recommendation}</CardLabel>
            <span className="inline-flex items-center gap-2 text-sm text-white/75">
              <span aria-hidden className="size-2 rounded-full bg-accent motion-safe:animate-pulse" />
              {t.live}
            </span>
          </div>

          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-number-sm font-light tracking-tight tabular-nums lg:text-number">
              {formatNumber(result.kw, locale)} {t.kwUnit}
            </span>
            <span className="text-base text-white/75">{result.plantType === "grid" ? t.grid : t.hybrid}</span>
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Stat label={t.generation} value={`${t.approx} ${formatNumber(roundTo(result.generationYear, 10), locale)} ${kwh}`} />
            <Stat label={t.savings} value={`${t.approx} ${formatNumber(roundTo(result.savingsYear, 100), locale)} ₴`} />
            <Stat label={t.battery} value={result.battery ? `${formatNumber(result.battery.capacityKwh, locale)} ${kwh}` : "—"} />
            <Stat label={t.backup} value={result.battery ? `${formatNumber(Math.round(result.battery.backupHours * 10) / 10, locale)} ${t.hoursUnit}` : "—"} />
          </dl>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/16 p-4">
            <span className="text-sm text-white/75">{t.payback}</span>
            {payback ? (
              <span className="font-heading text-stat-sm font-medium tabular-nums sm:text-stat">{payback}</span>
            ) : (
              <span className="text-right text-sm text-white/75">{t.enterBudget}</span>
            )}
          </div>

          {!result.battery && state.goal !== "savings" ? (
            <p className="text-sm text-white/75">{t.noProduct}</p>
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
          <p className="text-sm text-white/75">
            {format(t.footnote, { tariff: formatNumber(state.tariff, locale), region: region.name[locale] })}
          </p>
        </div>
      </div>
    </div>
  );
}
