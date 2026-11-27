import { insolationRegions } from "@/content/insolation";
import type { SesPowerPage } from "@/content/ses-power";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatDate, formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import type { PowerFacts } from "@/lib/ses-power-facts";

const DESCRIPTION_LIMIT = 160;

/**
 * Text of a power page with its numbers filled in: title, description, hero
 * lead and FAQ (the FAQ also feeds FAQPage JSON-LD). Templates live in
 * `messages.sesPower`; every number comes from `powerFacts`.
 */
export function powerValues(facts: PowerFacts, locale: Locale) {
  const n = (value: number) => formatNumber(value, locale);
  return {
    kw: n(facts.kw),
    panels: n(facts.panels),
    panelMin: n(facts.panelW.min),
    panelMax: n(facts.panelW.max),
    kwMin: n(facts.kwRange.min),
    kwMax: n(facts.kwRange.max),
    area: n(facts.area),
    panelArea: n(facts.panelArea),
    year: n(facts.year),
    month: n(facts.month),
    best: n(facts.best),
    december: n(facts.december),
    low: n(facts.fits.low),
    high: n(facts.fits.high),
    min: n(facts.leastSunny.year),
    max: n(facts.sunniest.year),
    minRegion: facts.leastSunny.region.name[locale],
    maxRegion: facts.sunniest.region.shortName[locale],
    spread: n(facts.spread),
    load: n(facts.houseLoad),
    small: n(facts.batteries.small.roundedKwh),
    big: n(facts.batteries.big.roundedKwh),
    smallHours: n(facts.houseHours.small),
    bigHours: n(facts.houseHours.big),
  };
}

export function powerTitle(page: SesPowerPage, locale: Locale): string {
  return format(getMessagesFor(locale).sesPower.meta.title[page.segment], { kw: formatNumber(page.kw, locale) });
}

export function powerDescription(page: Pick<SesPowerPage, "segment">, facts: PowerFacts, locale: Locale): string {
  const values = { ...powerValues(facts, locale), count: formatNumber(insolationRegions.length, locale) };
  // The full wording when it fits 160, then the shorter one (larger numbers on bigger plants).
  const variants = getMessagesFor(locale).sesPower.meta.description[page.segment].map((template) => format(template, values));
  return variants.find((text) => text.length <= DESCRIPTION_LIMIT) ?? variants[variants.length - 1];
}

export function powerHeroLead(facts: PowerFacts, locale: Locale): string {
  return format(getMessagesFor(locale).sesPower.hero.lead, powerValues(facts, locale));
}

export type PowerFaq = { id: string; question: string; answer: string };

export function powerFaq(page: SesPowerPage, facts: PowerFacts, locale: Locale): PowerFaq[] {
  const f = getMessagesFor(locale).sesPower.faq;
  const values = powerValues(facts, locale);
  const item = (id: string, question: string, answer: string): PowerFaq => ({ id, question: format(question, values), answer: format(answer, values) });
  return [
    item("panels", f.panelsQ, f.panelsA),
    item("area", f.areaQ, f.areaA),
    item("year", f.yearQ, f.yearA),
    item("enough", f.enoughQ[page.segment], f.enoughA[page.segment]),
    item("outage", f.outageQ, f.outageA),
    item("no-battery", f.noBatteryQ, f.noBatteryA),
    item("price", f.priceQ, f.priceA),
    item("help", f.helpQ, f.helpA),
  ];
}

/** «Оновлено: 27 листопада 2026» style date of the page revision. */
export function powerUpdated(page: SesPowerPage, locale: Locale): string {
  return formatDate(page.updatedAt, locale);
}
