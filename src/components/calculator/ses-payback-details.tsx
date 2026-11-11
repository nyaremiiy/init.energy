import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { householdTariff } from "@/content/tariffs";
import { insolationRegions } from "@/content/insolation";
import { products } from "@/content/products";
import { sesCalculatorProductCount, type SesObjectType } from "@/content/ses-calculator";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { SesCalculation, SesCalculationInput } from "@/lib/calc/ses";
import { formatNumber } from "@/lib/format";

type Copy = Messages["sesPayback"];

function format(value: number, locale: Locale, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "uk-UA", { maximumFractionDigits }).format(value);
}

export function SesPaybackDetails({ locale, copy, result }: { locale: Locale; copy: Copy; result: SesCalculation }) {
  const max = Math.max(...result.generationByMonth, result.monthlyKwh, 1);
  const peak = new Set([...result.generationByMonth.keys()].sort((a, b) => result.generationByMonth[b] - result.generationByMonth[a]).slice(0, 4));
  const methodRows = copy.formulaRows;
  const sourceRows = [
    [copy.yieldSource, copy.yieldSourceDetail],
    [copy.houseTariff, `${format(householdTariff.value, locale, 2)} ${locale === "uk" ? "грн" : "UAH"} · ${copy.tariffSource}`],
    [copy.productModels, String(sesCalculatorProductCount)],
    [copy.appliancePower, copy.applianceSource],
  ];
  return <>
    <div className="mt-section-sm grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <section id="ses-yield" aria-labelledby="ses-yield-title" className="rounded-panel-sm bg-surface p-card-sm sm:rounded-panel sm:p-card lg:col-span-8">
        <Heading as="h2" id="ses-yield-title" size="h3" className="text-ink">{copy.chartTitle}</Heading>
        <figure className="mt-6" aria-label={copy.ariaChart}>
          <div className="relative flex h-64 items-end gap-2 border-b border-line pb-2 sm:gap-3"><div aria-hidden className="pointer-events-none absolute inset-x-0 border-t border-dashed border-ink/50" style={{ bottom: `${Math.max(12, Math.min(88, (result.monthlyKwh / max) * 78))}%` }} />{result.generationByMonth.map((value, index) => <div key={index} className="z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-center text-xs text-ink/70">{format(Math.round(value / 10) * 10, locale)}</span><div className={`w-full rounded-t-lg ${peak.has(index) ? "bg-ink" : "bg-white"}`} style={{ height: `${Math.max(2, (value / max) * 78)}%` }} /><span className="text-xs text-ink/70">{copy.monthNames[index]}</span></div>)}</div>
          <figcaption className="mt-4 text-sm text-ink/70">{copy.chartCaption} {copy.monthlySource}</figcaption>
          <table className="sr-only"><caption>{copy.ariaChart}</caption><thead><tr><th>{copy.monthLabel}</th><th>{copy.generation}</th><th>{copy.consumption}</th></tr></thead><tbody>{result.generationByMonth.map((value, index) => <tr key={index}><th>{copy.monthNames[index]}</th><td>{format(value, locale, 1)} {copy.kwh}</td><td>{format(result.monthlyKwh, locale)} {copy.kwh}</td></tr>)}</tbody></table>
        </figure>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
        <article className="rounded-panel-sm bg-sky p-card-sm sm:rounded-panel sm:p-card"><p className="text-sm text-ink/70">{copy.surplus} · {copy.monthNames[result.surplus.monthIndex]}</p><p className="mt-3 font-heading text-number-sm font-medium text-ink">+{format(Math.round(result.surplus.kwh / 10) * 10, locale)} <span className="text-base">{copy.kwh}</span></p></article>
        <article className="rounded-panel-sm bg-navy p-card-sm text-white sm:rounded-panel sm:p-card"><p className="text-sm text-white/75">{copy.deficit} · {copy.monthNames[result.deficit.monthIndex]}</p><p className="mt-3 font-heading text-number-sm font-medium">−{format(Math.round(result.deficit.kwh / 10) * 10, locale)} <span className="text-base">{copy.kwh}</span></p></article>
      </div>
    </div>

    <section id="ses-method" aria-labelledby="ses-method-title" className="mt-section-sm rounded-panel-sm bg-ink p-card-sm text-white sm:rounded-panel sm:p-card lg:p-panel-y">
      <h2 id="ses-method-title" className="font-heading text-h2-sm font-semibold tracking-tight sm:text-h2-md">{copy.howTitle}</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12"><ol className="divide-y divide-white/20 lg:col-span-7">{methodRows.map((formula, index) => <li key={formula} className="grid grid-cols-12 gap-4 py-4"><span className="col-span-1 font-heading text-sm text-white/60">0{index + 1}</span><div className="col-span-11"><h3 className="font-heading text-base font-semibold">{copy.formulaTitles[index]}</h3><p className="mt-2 font-mono text-sm text-white/75">{formula}</p></div></li>)}</ol>
        <aside className="rounded-panel-sm bg-white/8 p-card-sm lg:col-span-5"><h3 className="font-heading text-h3-sm font-semibold">{copy.inputData}</h3><dl className="mt-4 divide-y divide-white/15 text-sm">{sourceRows.map(([key, value]) => <div key={key} className="flex justify-between gap-4 py-3"><dt className="text-white/70">{key}</dt><dd className="text-right">{value}</dd></div>)}</dl></aside></div>
      <p className="mt-6 max-w-4xl text-sm leading-relaxed text-white/75">{copy.notIncluded}</p>
    </section>

  </>;
}

export function SesPaybackLead({ locale, copy, input, result }: { locale: Locale; copy: Copy; input: SesCalculationInput; result: SesCalculation }) {
  const region = insolationRegions.find((item) => item.id === input.regionId) ?? insolationRegions[1];
  const summaryItems = [
    `${copy.objects[input.objectType]} · ${format(result.monthlyKwh, locale)} ${copy.kwh}/${copy.monthUnit}`,
    `${region.name[locale]} · ${format(result.kw, locale, 1)} ${copy.kwUnit}`,
    ...(result.battery ? [`${products[result.battery.id].name}${result.battery.modules > 1 ? ` × ${result.battery.modules}` : ""}`] : []),
    ...(input.goal !== "savings" ? [`${input.backupHours} ${copy.hoursUnit}`] : []),
  ];
  const objectType = input.objectType as SesObjectType;

  return <section id="ses-calculator-lead" aria-labelledby="ses-lead-title" className="bg-white py-section-sm lg:py-section">
    <Container className="grid scroll-mt-24 grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
      <div><Eyebrow>{copy.formEyebrow}</Eyebrow><h2 id="ses-lead-title" className="mt-5 font-heading text-h2-sm font-semibold tracking-tight text-heading sm:text-h2-md lg:text-h2">{copy.formTitle}</h2><p className="mt-5 max-w-3xl text-base leading-relaxed text-ink/70">{copy.formLead}</p><div className="mt-6 rounded-panel-sm bg-sky p-card-sm"><p className="font-heading text-base font-semibold text-ink">{copy.formSummary}</p><ul className="mt-3 flex flex-wrap gap-2">{summaryItems.map((item) => <li key={item} className="rounded-full bg-white px-3 py-2 text-sm text-ink">{item}</li>)}</ul></div></div>
      <div id="lead-form"><LeadForm defaultObjectType={objectType} cardTone="surface" /></div>
    </Container>
  </section>;
}

export function SesPaybackDataNote({ locale, copy, generation }: { locale: Locale; copy: Copy; generation: number }) {
  return <Container className="pb-section-sm"><p className="text-sm text-ink/60">{copy.updated} · {insolationRegions.length} {copy.regionsUnit} · <span className="sr-only">{formatNumber(generation, locale)} {copy.kwh}</span><a href="#ses-method" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ink">{copy.howTitle} ↓</a></p></Container>;
}
