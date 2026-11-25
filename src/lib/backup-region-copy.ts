import { loadSetById, loadSetHours, loadSetPowerW, outageExample, type LoadSet } from "@/content/backup";
import { offices } from "@/content/company";
import type { InsolationRegion } from "@/content/insolation";
import { partnerBrands } from "@/content/partner-brands";
import { products, type ProductId } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatPhone, formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";
import { isCity, isOccupied, regionArea, regionOffice, type RegionFaq } from "@/lib/region-copy";
import { regionStats } from "@/lib/region-stats";

/**
 * Texts of a backup power region page (/rezervne-zhyvlennya/{region}/) built
 * from content/insolation.ts (towns, office, grid operator), the runtime
 * calculation and the region's solar yield, with templates from messages
 * `backupRegionPage`. Pages differ by towns, office, operator and figures,
 * not only by the region name.
 */

const TITLE_LIMIT = 60;
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 160;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Runtime of a load set on a product, hours rounded for display; null when the load is above its output. */
export function setRuntime(set: LoadSet, id: ProductId): number | null {
  return loadSetHours(set.id, id);
}

export { loadSetById };

/** «Резервне живлення у Львові та Львівській області» from the solar H1 of the same region. */
export function backupH1(region: InsolationRegion, locale: Locale): string {
  const prefix = getMessagesFor(locale).backupRegionPage.h1Prefix;
  return region.h1[locale].replace(/^(Сонячні панелі|Solar panels)/, prefix);
}

/** «у Львові» (two places in the H1), otherwise the H1's own place: «у Києві», «в Київській області», «в Криму». */
function titlePlace(region: InsolationRegion, locale: Locale): string {
  const twoPlaces = region.h1[locale].includes(locale === "en" ? " and " : " та ");
  return twoPlaces ? region.centerLocative[locale] : region.h1[locale].replace(/^(Сонячні панелі|Solar panels)\s+/, "");
}

export function backupTitle(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.meta;
  const place = titlePlace(region, locale);
  const full = format(t.title, { place });
  return full.length <= TITLE_LIMIT ? full : format(t.titleShort, { place });
}

/** «Дрогобич, Стрий і Самбір» — towns after the centre (Kyiv: districts). */
function townList(region: InsolationRegion, locale: Locale, count: number): string {
  const towns = (isCity(region) ? region.cities : region.cities.slice(1)).slice(0, count).map((town) => town[locale]);
  // English templates continue with «and other towns», so no second «and» inside the list.
  if (towns.length < 2 || locale === "en") return towns.join(", ");
  const and = " і ";
  return `${towns.slice(0, -1).join(", ")}${and}${towns[towns.length - 1]}`;
}

export function backupDescription(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.meta;
  if (isOccupied(region)) {
    // «в Автономній Республіці Крим» does not fit — then the short place from the H1 («в Криму»).
    const full = format(t.descriptionOccupied, { locative: region.locative[locale] });
    return full.length <= DESCRIPTION_MAX ? full : format(t.descriptionOccupied, { locative: titlePlace(region, locale) });
  }
  const area = regionArea(region, locale);
  const templates = isCity(region) ? t.descriptionsCity : t.descriptions;
  // As many towns as fit in 140–160 characters (longer wording first); then the wording without towns.
  for (let count = region.cities.length; count >= 1; count -= 1) {
    for (const template of templates) {
      const text = format(template, { area, cities: townList(region, locale, count) });
      if (text.length >= DESCRIPTION_MIN && text.length <= DESCRIPTION_MAX) return text;
    }
  }
  const short = format(t.descriptionShort, { area });
  return short.length <= DESCRIPTION_MAX ? short : `${short.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
}

export function backupHeroLead(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.hero;
  if (isOccupied(region)) return format(t.leadOccupied, { locative: region.locative[locale] });
  if (isCity(region)) return format(t.leadCity, { cities: townList(region, locale, 3).replace(locale === "en" ? " and " : " і ", ", ") });
  return format(t.lead, { area: regionArea(region, locale), cities: townList(region, locale, 3) });
}

/** First paragraph of «Резервне живлення {в області}»: the direct answer about outages, then coverage and the office. */
export function backupLocalLead(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.local;
  const answer = format(t.lead, { locative: region.locative[locale] });
  if (isOccupied(region)) return `${answer} ${t.coverageOccupied}`;
  const office = regionOffice(region);
  const area = regionArea(region, locale);
  const coverage = office
    ? format(t.coverageOffice, { area, centerLocative: region.centerLocative[locale], address: office.address[locale] })
    : format(t.coverage, { area });
  return `${answer} ${coverage}`;
}

export function backupScheduleText(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.local.schedule;
  const operator = region.gridOperator?.name[locale];
  return operator ? format(t.text, { locative: region.locative[locale], operator }) : t.textGeneric;
}

export function backupSolarText(region: InsolationRegion, locale: Locale): string {
  const t = getMessagesFor(locale).backupRegionPage.local.solar;
  return format(t.text, { Locative: capitalize(region.locative[locale]), year: formatNumber(regionStats(region).year, locale) });
}

export function backupFaq(region: InsolationRegion, locale: Locale): RegionFaq[] {
  const messages = getMessagesFor(locale);
  const f = messages.backupRegionPage.faq;
  const n = (value: number) => formatNumber(value, locale);
  const locative = region.locative[locale];
  const houseSet = loadSetById(outageExample.loadSet);
  const basicSet = loadSetById("basic");
  const houseLoad = formatQuantity({ value: loadSetPowerW(houseSet), unit: "W" }, locale);
  const operator = region.gridOperator?.name[locale];

  const items: RegionFaq[] = [
    {
      id: "apartment",
      question: format(f.apartmentQ, { centerLocative: region.centerLocative[locale] }),
      answer: format(f.apartmentA, {
        station: products.svit600.name,
        capacity: formatQuantity(products.svit600.capacity, locale),
        hours: n(setRuntime(basicSet, "svit600") ?? 0),
        kit: products.svitHome.name,
      }),
    },
    {
      id: "brands",
      question: f.brandsQ,
      answer: format(isOccupied(region) ? f.brandsAOccupied : f.brandsA, {
        brands: partnerBrands.map((brand) => brand.name).join(", ").replace(/, ([^,]+)$/, locale === "en" ? " and $1" : " і $1"),
        locative,
      }),
    },
    {
      id: "solar",
      question: format(f.solarQ, { locative }),
      answer: format(f.solarA, { Locative: capitalize(locative), locative, year: n(regionStats(region).year) }),
    },
    {
      id: "runtime",
      question: format(f.runtimeQ, { locative }),
      answer: `${format(f.runtimeA, {
        load: houseLoad,
        home: products[outageExample.product].name,
        homeHours: n(setRuntime(houseSet, outageExample.product) ?? 0),
        outage: n(outageExample.hours),
        big: products.svitPlus16000.name,
        bigHours: n(setRuntime(houseSet, "svitPlus16000") ?? 0),
      })} ${operator ? format(f.runtimeOperator, { operator }) : f.runtimeGeneric}`,
    },
  ];

  if (!isOccupied(region)) {
    const r = messages.regionPage.faq;
    const office = regionOffice(region);
    const contact = office
      ? format(r.coverageOffice, {
          centerLocative: region.centerLocative[locale],
          address: office.address[locale],
          phone: formatPhone(office.phone.display),
        })
      : format(r.coverageCall, { phone: formatPhone(offices[0].phone.display) });
    items.push({
      id: "coverage",
      question: isCity(region) ? r.coverageQCity : format(r.coverageQ, { regionDative: locative.replace(/^(у|в|in)\s+/, "") }),
      answer: `${isCity(region) ? f.coverageACity : format(f.coverageA, { locative })} ${contact}`,
    });
  }

  return items;
}
