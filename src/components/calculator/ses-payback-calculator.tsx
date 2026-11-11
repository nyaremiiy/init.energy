"use client";

import { ArrowUpRight, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { appliances, defaultApplianceIds } from "@/content/appliances";
import { insolationRegions, regionsByLocale } from "@/content/insolation";
import { householdTariff } from "@/content/tariffs";
import { sesCalculatorConfig, type SesGoal, type SesObjectType, type SesPlacement } from "@/content/ses-calculator";
import { calculateSes, type SesCalculationInput } from "@/lib/calc/ses";
import { applyCalculatorToLeadForm } from "@/lib/calculator-bridge";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/i18n/client";

type Copy = {
  steps: string[]; objectType: string; objects: Record<SesObjectType, string>; goal: string; goals: Record<SesGoal, string>;
  consumption: string; kwh: string; monthlyBill: string; tariff: string; tariffValid: string; heatingHint: string; businessTariff: string;
  region: string; placement: string; placements: Record<SesPlacement, string>; roofArea: string; roofLimit: string; backupLoads: string;
  backupHours: string; hoursUnit: string; budget: string; budgetHint: string; recommendation: string; live: string; grid: string; hybrid: string;
  generation: string; savings: string; battery: string; backup: string; payback: string; enterBudget: string; hybridInverter: string;
  noProduct: string; quote: string; footnote: string; updated: string; details: string; chartTitle: string; chartCaption: string;
  surplus: string; deficit: string; monthNames: string[]; ariaChart: string; approx: string; months: string; year: string; noBudget: string;
  howTitle: string; inputData: string; yieldSource: string; houseTariff: string; productModels: string; appliancePower: string; notIncluded: string;
  formEyebrow: string; formTitle: string; formLead: string; formSummary: string;
  kwUnit: string; monthUnit: string; monthlyBillHint: string; regionsUnit: string;
};

type InitialValues = Partial<SesCalculationInput>;

const fieldClasses = "h-14 w-full rounded-field border border-line bg-white px-4.5 text-base text-ink placeholder:text-ink/45 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/10";
const labelClasses = "flex flex-col gap-2 text-sm font-medium text-ink";

function format(value: number, locale: string, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "uk-UA", { maximumFractionDigits }).format(value);
}

function ChoiceGroup<T extends string>({ label, name, values, value, labels, onChange }: { label: string; name: string; values: readonly T[]; value: T; labels: Record<T, string>; onChange: (value: T) => void }) {
  return <fieldset className="flex flex-col gap-3 border-0 p-0">
    <legend className="text-sm font-medium text-ink">{label}</legend>
    <div className="flex flex-wrap gap-2">{values.map((option) => <label key={option} className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-within:ring-3 focus-within:ring-ink/15 ${value === option ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/50"}`}>
      <input className="sr-only" type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />{labels[option]}
    </label>)}</div>
  </fieldset>;
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return <fieldset className="flex flex-col gap-5 border-0 border-t border-line p-0 pt-6">
    <legend className="sr-only">{title}</legend>
    <div className="flex items-center gap-3"><span className="inline-flex size-8 items-center justify-center rounded-full bg-sky font-heading text-sm font-semibold text-ink">{String(number).padStart(2, "0")}</span><h2 className="font-heading text-h3-sm font-semibold text-ink sm:text-h3">{title}</h2></div>
    {children}
  </fieldset>;
}

export function SesPaybackCalculator({ copy, initial = {} }: { copy: Copy; initial?: InitialValues }) {
  const locale = useLocale();
  const router = useRouter();
  const [objectType, setObjectType] = useState<SesObjectType>(initial.objectType ?? sesCalculatorConfig.defaults.objectType);
  const [goal, setGoal] = useState<SesGoal>(initial.goal ?? sesCalculatorConfig.defaults.goal);
  const [monthlyKwh, setMonthlyKwh] = useState(initial.monthlyKwh ?? sesCalculatorConfig.consumption.default);
  const [monthlyBill, setMonthlyBill] = useState(initial.monthlyBill ?? 0);
  const [tariff, setTariff] = useState(initial.tariff ?? (objectType === "business" ? 0 : householdTariff.value));
  const [regionId, setRegionId] = useState(initial.regionId ?? sesCalculatorConfig.defaults.regionId);
  const [placement, setPlacement] = useState<SesPlacement>(initial.placement ?? sesCalculatorConfig.defaults.placement);
  const [roofArea, setRoofArea] = useState(initial.roofAreaM2 ?? 0);
  const [backupLoads, setBackupLoads] = useState<string[]>(initial.backupLoads ?? [...defaultApplianceIds]);
  const [backupHours, setBackupHours] = useState(initial.backupHours ?? sesCalculatorConfig.backupHours.default);
  const [budget, setBudget] = useState(initial.budget ?? 0);
  const [showSheet, setShowSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastChangeAt = useRef(0);
  const input = useMemo<SesCalculationInput>(() => ({ objectType, goal, monthlyKwh: monthlyBill > 0 ? undefined : monthlyKwh, monthlyBill: monthlyBill > 0 ? monthlyBill : undefined, tariff, regionId, placement, roofAreaM2: roofArea || undefined, backupLoads, backupHours, budget: budget || undefined }), [objectType, goal, monthlyKwh, monthlyBill, tariff, regionId, placement, roofArea, backupLoads, backupHours, budget]);
  const result = useMemo(() => calculateSes(input), [input]);
  const region = insolationRegions.find((item) => item.id === regionId) ?? insolationRegions[1];
  const localizedRegions = regionsByLocale(locale);

  useEffect(() => { trackEvent({ event: "calculator_start" }); }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("object", objectType); query.set("goal", goal); query.set("kwh", String(Math.round(result.monthlyKwh))); query.set("tariff", String(tariff)); query.set("region", regionId); query.set("placement", placement); query.set("hours", String(backupHours));
    if (monthlyBill) query.set("bill", String(monthlyBill));
    if (roofArea) query.set("roof", String(roofArea)); if (budget) query.set("budget", String(budget)); if (backupLoads.length) query.set("loads", backupLoads.join(","));
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      const current = new URLSearchParams(window.location.search);
      ["object", "goal", "kwh", "bill", "tariff", "region", "placement", "hours", "roof", "budget", "loads"].forEach((key) => current.delete(key));
      query.forEach((value, key) => current.set(key, value));
      router.replace(current.size ? `?${current.toString()}` : window.location.pathname, { scroll: false });
    }, 100);
    return () => { if (updateTimer.current) clearTimeout(updateTimer.current); };
  }, [objectType, goal, result.monthlyKwh, monthlyBill, tariff, regionId, placement, roofArea, backupHours, backupLoads, budget, router]);

  useEffect(() => { trackEvent({ event: "calculator_result_view", kw: result.kw, product: result.battery?.id ?? "none", region: regionId }); }, [result.kw, result.battery?.id, regionId]);
  useEffect(() => {
    if (!showSheet) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => sheetRef.current?.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [];
    focusable()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowSheet(false);
      if (event.key === "Tab") {
        const elements = [...focusable()]; const first = elements[0]; const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [showSheet]);

  function handoff() {
    const summary = `${copy.objects[objectType]} · ${format(result.monthlyKwh, locale)} ${copy.kwh}/${copy.monthUnit} · ${region.name[locale]} · ${format(result.kw, locale, 1)} ${copy.kwUnit} · ${backupHours} ${copy.hoursUnit}${result.battery ? ` · ${result.battery.name}${result.battery.modules > 1 ? ` × ${result.battery.modules}` : ""}` : ""}`;
    applyCalculatorToLeadForm({ objectType, summary, data: JSON.stringify({ input, result }) });
    trackEvent({ event: "calculator_cta_click", kw: result.kw, product: result.battery?.id ?? "none", region: regionId });
    document.getElementById("ses-calculator-lead")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowSheet(false);
  }

  const stat = (label: string, value: string) => <div className="flex flex-col gap-2 rounded-2xl bg-white/8 p-4"><span className="text-sm text-white/70">{label}</span><span className="font-heading text-stat-sm font-semibold text-white sm:text-stat">{value}</span></div>;
  const resultCard = (mobile = false) => <div ref={resultRef} className={`rounded-panel-sm bg-ink p-card-sm text-white sm:rounded-panel sm:p-card ${mobile ? "" : "lg:sticky lg:top-6"}`}>
    <div className="mb-6 flex items-center justify-between gap-4"><p className="font-heading text-sm font-semibold uppercase tracking-wide">{copy.recommendation}</p><span className="inline-flex items-center gap-2 text-xs text-white/75"><span className="size-2 rounded-full bg-accent" />{copy.live}</span></div>
    <p className="flex flex-wrap items-baseline gap-x-3"><strong className="font-heading text-number-sm font-medium tracking-tight sm:text-number">{format(result.kw, locale, 1)}</strong><span className="text-base text-white/80">{copy.kwUnit} · {result.plantType === "grid" ? copy.grid : copy.hybrid}</span></p>
    <div className="mt-6 grid grid-cols-2 gap-3">
      {stat(copy.generation, `${copy.approx} ${format(Math.round(result.generationYear / 10) * 10, locale)} ${copy.kwh}`)}
      {stat(copy.savings, `${copy.approx} ${format(Math.round(result.savingsYear / 100) * 100, locale)} ₴`)}
      {stat(copy.battery, result.battery ? `${format(result.battery.capacityKwh, locale, 2)} ${copy.kwh}` : "—")}
      {stat(copy.backup, result.battery ? `${format(result.battery.backupHours, locale, 1)} ${copy.hoursUnit}` : "—")}
    </div>
    <div className="my-5 border-y border-white/20 py-4"><div className="flex items-center justify-between gap-3"><span className="text-sm text-white/70">{copy.payback}</span><span className="font-heading text-base font-semibold">{result.paybackYears ? `${format(result.paybackYears, locale, 1)} ${copy.year}` : copy.enterBudget}</span></div></div>
    {result.battery ? <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white/8 p-4">
      <MediaPlaceholder caption="SVIT" tone="dark" className="size-16 shrink-0 rounded-xl p-0 text-xs" />
      <div className="min-w-0 flex-1"><p className="font-heading font-semibold">{result.battery.name}{result.battery.modules > 1 ? ` × ${result.battery.modules}` : ""}</p><p className="mt-1 text-sm text-white/70">{format(result.battery.capacityKwh, locale, 2)} {copy.kwh}{result.battery.inverterNote ? ` · ${copy.hybridInverter}` : ""}</p></div>
      <Link href={result.battery.href} aria-label={`${result.battery.name} details`} className="rounded-full p-2 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"><ChevronDown aria-hidden className="size-5 -rotate-90" /></Link>
    </div> : goal !== "savings" ? <p className="mb-5 rounded-2xl bg-white/8 p-4 text-sm text-white/80">{copy.noProduct}</p> : null}
    <Button type="button" variant="primary" className="w-full" onClick={handoff} icon={<ArrowUpRight aria-hidden className="size-4.5" />}>{copy.quote}</Button>
    <p className="mt-4 text-sm leading-relaxed text-white/70">{copy.footnote.replace("{tariff}", format(tariff, locale, 2)).replace("{region}", region.name[locale])}</p>
  </div>;

  return <>
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
      <form className="flex min-w-0 flex-col gap-7 rounded-panel-sm border border-line bg-white p-card-sm sm:rounded-panel sm:p-card lg:col-span-7" onSubmit={(event) => event.preventDefault()} onChange={(event) => { const target = event.target; const field = target instanceof HTMLInputElement || target instanceof HTMLSelectElement ? target.name : ""; if (field && Date.now() - lastChangeAt.current > 350) { lastChangeAt.current = Date.now(); trackEvent({ event: "calculator_change", field }); } }}>
        <Step number={1} title={copy.steps[0]}>
          <ChoiceGroup label={copy.objectType} name="objectType" values={["apartment", "house", "business"] as const} value={objectType} labels={copy.objects} onChange={(next) => { setObjectType(next); if (next === "business") setTariff(0); else if (!tariff) setTariff(householdTariff.value); }} />
          <ChoiceGroup label={copy.goal} name="goal" values={["savings", "backup", "both"] as const} value={goal} labels={copy.goals} onChange={setGoal} />
        </Step>
        <Step number={2} title={copy.steps[1]}>
          <label className={labelClasses}>{copy.consumption}<span className="font-heading text-number-sm font-medium tracking-tight text-ink">{format(result.monthlyKwh, locale)} <span className="text-base">{copy.kwh}</span></span><input name="monthlyKwh" type="range" min={sesCalculatorConfig.consumption.min} max={sesCalculatorConfig.consumption.max} step={sesCalculatorConfig.consumption.step} value={Math.min(result.monthlyKwh, sesCalculatorConfig.consumption.max)} aria-valuetext={`${format(result.monthlyKwh, locale)} ${copy.kwh}`} onChange={(event) => { setMonthlyBill(0); setMonthlyKwh(Number(event.target.value)); }} className="w-full accent-ink" /><span className="flex justify-between text-xs font-normal text-ink/60"><span>{sesCalculatorConfig.consumption.min} {copy.kwh}</span><span>1 200+</span></span></label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className={labelClasses}>{copy.tariff}<input name="tariff" type="number" min="0.01" step="0.01" required={objectType === "business"} value={tariff || ""} onChange={(event) => setTariff(Number(event.target.value) || 0)} className={fieldClasses} />{objectType === "business" ? <span className="font-normal text-ink/70">{copy.businessTariff}</span> : <span className="font-normal text-ink/70">{copy.tariffValid} {copy.heatingHint}</span>}</label><label className={labelClasses}>{copy.monthlyBill}<input name="monthlyBill" type="number" min="0" step="100" value={monthlyBill || ""} onChange={(event) => setMonthlyBill(Number(event.target.value) || 0)} placeholder="—" className={fieldClasses} /><span className="font-normal text-ink/70">{copy.monthlyBillHint}</span></label></div>
        </Step>
        <Step number={3} title={copy.steps[2]}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className={labelClasses}>{copy.region}<select value={regionId} onChange={(event) => setRegionId(event.target.value)} className={fieldClasses}>{localizedRegions.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}</select></label><label className={labelClasses}>{copy.placement}<select value={placement} onChange={(event) => setPlacement(event.target.value as SesPlacement)} className={fieldClasses}>{(Object.keys(copy.placements) as SesPlacement[]).map((item) => <option key={item} value={item}>{copy.placements[item]}</option>)}</select></label></div>
          <label className={labelClasses}>{copy.roofArea}<input type="number" min="1" step="1" value={roofArea || ""} onChange={(event) => setRoofArea(Number(event.target.value) || 0)} placeholder="—" className={fieldClasses} /></label>{result.limitedByRoof ? <p role="status" className="rounded-xl bg-sky p-4 text-sm text-ink">{copy.roofLimit}</p> : null}
        </Step>
        {goal !== "savings" ? <Step number={4} title={copy.steps[3]}>
          <fieldset className="border-0 p-0"><legend className="mb-3 text-sm font-medium text-ink">{copy.backupLoads}</legend><div className="flex flex-wrap gap-2">{appliances.map((item) => { const checked = backupLoads.includes(item.id); return <label key={item.id} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium focus-within:ring-3 focus-within:ring-ink/15 ${checked ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}><input type="checkbox" className="sr-only" checked={checked} onChange={() => setBackupLoads((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])} /><Check aria-hidden className={`size-4 ${checked ? "" : "invisible"}`} />{item.name[locale]}</label>; })}</div></fieldset>
          <label className={labelClasses}>{copy.backupHours}: {backupHours}<input type="range" min={sesCalculatorConfig.backupHours.min} max={sesCalculatorConfig.backupHours.max} step="1" value={backupHours} aria-valuetext={`${backupHours} ${copy.hoursUnit}`} onChange={(event) => setBackupHours(Number(event.target.value))} className="w-full accent-ink" /><span className="flex justify-between text-xs font-normal text-ink/60"><span>{sesCalculatorConfig.backupHours.min}</span><span>{sesCalculatorConfig.backupHours.max}</span></span></label>
        </Step> : null}
        <Step number={goal === "savings" ? 4 : 5} title={copy.steps[4]}>
          <label className={labelClasses}>{copy.budget}<input type="number" min="0" step="1000" value={budget || ""} onChange={(event) => setBudget(Number(event.target.value) || 0)} placeholder="—" className={fieldClasses} /><span className="font-normal text-ink/70">{copy.budgetHint}</span></label>
        </Step>
      </form>
      <div className="hidden lg:col-span-5 lg:block">{resultCard()}</div>
    </div>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 shadow-card lg:hidden"><button type="button" className="flex w-full items-center justify-between gap-3 rounded-full bg-ink px-5 py-3 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" onClick={() => setShowSheet(true)}><span><span className="font-heading font-semibold">{format(result.kw, locale, 1)} {copy.kwUnit}</span><span className="ml-3 text-sm text-white/75">{result.battery?.name ?? format(result.savingsYear, locale)} </span></span><span className="text-sm font-medium">{copy.details}</span></button></div>
    {showSheet ? <div className="fixed inset-0 z-50 flex items-end bg-ink/60 lg:hidden" onClick={() => setShowSheet(false)}><div ref={sheetRef} role="dialog" aria-modal="true" aria-label={copy.recommendation} className="max-h-dvh w-full overflow-y-auto rounded-t-panel-sm bg-white p-card-sm" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex justify-end"><button type="button" aria-label="Close" onClick={() => setShowSheet(false)} className="rounded-full p-2 text-ink focus-visible:outline-2 focus-visible:outline-ink"><X aria-hidden className="size-5" /></button></div>{resultCard(true)}</div></div> : null}
    <p className="mt-6 text-sm text-ink/60">{copy.updated} · {insolationRegions.length} {copy.regionsUnit}</p>
  </>;
}
