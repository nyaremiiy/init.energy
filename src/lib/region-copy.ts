import { offices } from "@/content/company";
import type { InsolationRegion } from "@/content/insolation";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatPhone } from "@/lib/format";
import { format } from "@/lib/messages";
import { houseExamples, regionStats, type RegionStats } from "@/lib/region-stats";

/**
 * Texts of a region page built from the region's data and the templates in
 * messages `regionPage`. Every number comes from region-stats.ts, so two
 * regions never share a sentence with the same figures.
 */

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** «Львівській області» from «у Львівській області» (for «по всій …»). */
function withoutPreposition(text: string): string {
  return text.replace(/^(у|в|in)\s+/, "");
}

export function isOccupied(region: InsolationRegion): boolean {
  return region.serviceNote === "occupied";
}

export function isCity(region: InsolationRegion): boolean {
  return region.areaType === "City";
}

/** «у Львові та області»; Kyiv and Kyiv Oblast use their own locative (no separate centre). */
export function regionArea(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).regionPage;
  if (isCity(region) || !region.h1[locale].includes(locale === "en" ? " and " : " та ")) {
    return region.locative[locale];
  }
  return format(t.areaRegion, { centerLocative: region.centerLocative[locale] });
}

export function regionTitle(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).regionPage.meta;
  const twoPlaces = region.h1[locale].includes(locale === "en" ? " and " : " та ");
  const base = twoPlaces ? format(t.title, { centerLocative: region.centerLocative[locale] }) : region.h1[locale];
  const full = base + (isOccupied(region) ? t.suffixOccupied : t.suffix);
  return full.length <= TITLE_LIMIT ? full : base;
}

export function regionDescription(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).regionPage.meta;
  const values = { locative: region.locative[locale], year: formatNumber(regionStats(region).year, locale) };
  // The full wording when it fits, then the shorter one (long region names), then a cut at a word.
  const variants = (isOccupied(region) ? [t.descriptionOccupied] : [t.description, t.descriptionShort]).map((template) => format(template, values));
  const fitting = variants.find((text) => text.length <= DESCRIPTION_LIMIT);
  return fitting ?? `${variants[variants.length - 1].slice(0, DESCRIPTION_LIMIT - 1).replace(/\s+\S*$/, "")}…`;
}

export function heroLead(region: InsolationRegion, locale: Locale, stats: RegionStats): string {
  const t = getMessagesFor(locale).regionPage.hero;
  const values = {
    area: regionArea(region, locale),
    locative: region.locative[locale],
    year: formatNumber(stats.year, locale),
    month: formatNumber(stats.monthAverage, locale),
  };
  return format(isOccupied(region) ? t.leadOccupied : t.lead, values);
}

type Direction = "Less" | "More" | "Equal";
function direction(deviation: number): Direction {
  return deviation < 0 ? "Less" : deviation > 0 ? "More" : "Equal";
}

/** Signed percent for a card: «−8 %», «+16 %», «0 %». */
export function signedPercent(value: number, locale: Locale): string {
  const sign = value < 0 ? "−" : value > 0 ? "+" : "";
  const space = locale === "uk" ? " " : "";
  return `${sign}${formatNumber(Math.abs(value), locale)}${space}%`;
}

export function yieldLead(region: InsolationRegion, locale: Locale, stats: RegionStats): string {
  const t = getMessagesFor(locale).regionPage.yield;
  const start = format(t.leadStart, {
    Locative: capitalize(region.locative[locale]),
    year: formatNumber(stats.year, locale),
    month: formatNumber(stats.monthAverage, locale),
  });
  const tail = format(t[`lead${direction(stats.deviation)}`], { pct: formatNumber(Math.abs(stats.deviation), locale) });
  return `${start} ${tail}`;
}

export function deviationLabel(stats: RegionStats, locale: Locale): string {
  return getMessagesFor(locale).regionPage.yield[`deviation${direction(stats.deviation)}`];
}

export type RegionFaq = { id: string; question: string; answer: string };

export function regionFaq(region: InsolationRegion, locale: Locale, stats: RegionStats): RegionFaq[] {
  const t = getMessagesFor(locale).regionPage;
  const f = t.faq;
  const n = (value: number) => formatNumber(value, locale);
  const locative = region.locative[locale];
  const items: RegionFaq[] = [
    {
      id: "profit",
      question: format(f.profitQ, { locative }),
      answer: format(f[`profit${direction(stats.deviation)}`], { year: n(stats.year), pct: n(Math.abs(stats.deviation)) }),
    },
    {
      id: "panels",
      question: format(f.panelsQ, { locative }),
      answer: format(f.panelsA, {
        kwh: n(houseExamples.small),
        kwhBig: n(houseExamples.big),
        locative,
        kw: n(stats.kwSmall),
        kwBig: n(stats.kwBig),
        // ≈ 500 W per panel, as «5 kW ≈ 10 panels» on the page.
        panels: n(stats.kwSmall * 2),
      }),
    },
    {
      id: "winter",
      question: format(f.winterQ, { centerLocative: region.centerLocative[locale] }),
      answer: format(f.winterA, {
        centerLocative: region.centerLocative[locale],
        december: n(stats.december),
        ratio: n(Math.round(stats.best.kwh / stats.december)),
        bestMonth: t.monthsLocative[stats.best.index],
        best: n(stats.best.kwh),
      }),
    },
  ];

  if (!isOccupied(region)) {
    const office = regionOffice(region);
    // Offices are in the centre of their own region (Lviv, Kyiv): «у Львові».
    const contact = office
      ? format(f.coverageOffice, {
          centerLocative: region.centerLocative[locale],
          address: office.address[locale],
          phone: formatPhone(office.phone.display),
        })
      : format(f.coverageCall, { phone: formatPhone(offices[0].phone.display) });
    items.push({
      id: "coverage",
      question: isCity(region) ? f.coverageQCity : format(f.coverageQ, { regionDative: withoutPreposition(locative) }),
      answer: `${isCity(region) ? f.coverageACity : format(f.coverageA, { locative })} ${contact}`,
    });
  }

  return items;
}

/** The office located in this region (Lviv, Kyiv), if any. */
export function regionOffice(region: InsolationRegion) {
  return region.office ? offices.find((item) => item.id === region.office) : undefined;
}
