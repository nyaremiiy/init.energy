import { MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ContactLink } from "@/components/ui/contact-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { nationwideService, offices } from "@/content/company";
import { updatedAt, type InsolationRegion } from "@/content/insolation";
import { anchors } from "@/content/routes";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatDate, formatNumber, formatPhone } from "@/lib/format";
import { format } from "@/lib/messages";
import { deviationLabel, isCity, isOccupied, regionOffice, signedPercent, yieldLead } from "@/lib/region-copy";
import { houseExamples, nationalStationYear, regionStats, type RegionStats } from "@/lib/region-stats";

const titleId = "region-yield-title";

type Props = { region: InsolationRegion; locale: Locale };

/** Monthly output of the 5 kW plant: bars with values (HTML, not canvas) and an sr-only table. */
function RegionChart({ region, locale, stats }: Props & { stats: RegionStats }) {
  const t = getMessages().regionPage;
  const y = t.yield;
  const max = Math.max(...stats.months);
  const peaks = new Set(stats.peaks);

  return (
    <figure className="flex h-full flex-col gap-6 rounded-card border border-line bg-white p-card-sm lg:p-card">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <Heading as="h3" size="h3" weight="semibold" className="text-ink">
          {y.chartTitle}
        </Heading>
        <span className="text-small text-muted">{format(y.chartUnit, { name: region.name[locale] })}</span>
      </div>

      <div aria-hidden className="flex h-64 items-end gap-1 border-b border-line sm:gap-2 lg:h-auto lg:min-h-64 lg:flex-1">
        {stats.months.map((value, index) => (
          <div key={t.monthsShort[index]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="hidden text-caption text-muted tabular-nums sm:block">{formatNumber(Math.round(value), locale)}</span>
            <span
              className={`w-full rounded-t-tile ${peaks.has(index) ? "bg-ink" : "bg-accent"}`}
              style={{ height: `${(value / max) * 85}%` }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="-mt-4 flex gap-1 sm:gap-2">
        {t.monthsShort.map((name) => (
          <span key={name} className="min-w-0 flex-1 text-center text-caption text-muted">
            {/* One letter on phones: twelve short names do not fit at 360 px. */}
            <span className="sm:hidden">{name.charAt(0)}</span>
            <span className="hidden sm:inline">{name}</span>
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{format(y.tableCaption, { name: region.name[locale] })}</caption>
        <thead>
          <tr>
            <th scope="col">{y.tableMonth}</th>
            <th scope="col">{y.tableKwh}</th>
          </tr>
        </thead>
        <tbody>
          {stats.months.map((value, index) => (
            <tr key={t.monthsLong[index]}>
              <th scope="row">{t.monthsLong[index]}</th>
              <td>{formatNumber(Math.round(value), locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption className="text-small text-muted">
        {format(y.chartNote, {
          best: formatNumber(stats.best.kwh, locale),
          december: formatNumber(stats.december, locale),
        })}
      </figcaption>
    </figure>
  );
}

/** «Де працюємо в області»: towns (or Kyiv districts) and a phone — the office one where there is an office. */
function RegionAreaCard({ region, locale }: Props) {
  const t = getMessages().regionPage.area;
  const office = regionOffice(region);
  const phone = (office ?? offices[0]).phone;
  const phoneText = formatPhone(phone.display);
  const city = isCity(region);
  const text = isOccupied(region)
    ? t.textOccupied
    : city
      ? t.textCity
      : format(t.text, { centerLocative: region.centerLocative[locale] });

  return (
    <article className="flex h-full flex-col gap-6 rounded-card bg-ink-glow p-card-sm text-white lg:p-card">
      <div className="flex flex-col gap-3">
        <Eyebrow tone="dark">{region.name[locale]}</Eyebrow>
        <Heading as="h3" size="h3" weight="semibold">
          {city ? t.titleCity : t.title}
        </Heading>
        <p className="text-body text-muted-dark">{text}</p>
      </div>

      <ul aria-label={city ? t.districtsLabel : t.citiesLabel} className="grid grid-cols-2 gap-x-6">
        {region.cities.map((item) => (
          <li key={item.uk} className="flex min-w-0 items-center gap-2 border-b border-line-dark py-2.5 text-small">
            <MapPin aria-hidden className="size-4 shrink-0 text-muted-dark" />
            <span className="min-w-0 truncate">{item[locale]}</span>
          </li>
        ))}
      </ul>

      <ContactLink
        href={phone.href}
        method="phone"
        location="region_page"
        aria-label={format(t.callLabel, { phone: phoneText })}
        className="group mt-auto flex items-center gap-4 rounded-tile bg-fill-dark p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <IconButton decorative variant="solid-light" size="sm" icon="phone" className="transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105" />
        <span className="flex min-w-0 flex-col">
          <span className="text-caption text-muted-dark">
            {office
              ? format(t.office, { centerLocative: region.centerLocative[locale], address: office.address[locale] })
              : nationwideService.text[locale]}
          </span>
          <span className="font-heading text-lead font-semibold whitespace-nowrap tabular-nums">{phoneText}</span>
        </span>
      </ContactLink>
    </article>
  );
}

/**
 * «Скільки енергії дають сонячні панелі {в області}»: a direct answer, four
 * figures, the monthly chart and where we work. Every number is computed
 * from the region's yield (lib/region-stats.ts).
 */
export function RegionYield({ region, locale }: Props) {
  const messages = getMessages();
  const t = messages.regionPage.yield;
  const units = messages.units;
  const stats = regionStats(region);
  const n = (value: number) => formatNumber(value, locale);

  const cards = [
    { value: n(stats.year), unit: units.kWh, label: t.yearLabel, note: format(t.yearNote, { month: n(stats.monthAverage) }) },
    {
      value: signedPercent(stats.deviation, locale),
      label: deviationLabel(stats, locale),
      note: format(t.deviationNote, { national: n(nationalStationYear) }),
    },
    {
      value: `≈ ${n(stats.best.kwh)}`,
      unit: units.kWh,
      label: format(t.bestLabel, { month: messages.regionPage.monthsLocative[stats.best.index], december: n(stats.december) }),
      note: t.bestNote,
    },
    {
      value: n(stats.kwSmall),
      unit: units.kW,
      label: format(t.houseLabel, { kwh: n(houseExamples.small) }),
      note: format(t.houseNote, { kwh: n(houseExamples.big), kw: n(stats.kwBig) }),
    },
  ];

  return (
    <section id={anchors.regionYield} aria-labelledby={titleId} className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="SOLAR" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={format(t.title, { locative: region.locative[locale] })}
            titleId={titleId}
            lead={yieldLead(region, locale, stats)}
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => (
                <div key={card.label} className="flex flex-col gap-2 rounded-card bg-surface p-card-sm lg:p-card">
                  {/* dt first in the markup (valid <dl>), shown under the value. */}
                  <dt className="order-2 mt-2 text-body font-medium text-ink">{card.label}</dt>
                  <dd className="order-1 flex items-baseline gap-2 font-heading text-number-sm font-light tracking-tight whitespace-nowrap text-ink tabular-nums">
                    {card.value}
                    {card.unit ? <span className="font-sans text-small font-normal tracking-normal text-muted">{card.unit}</span> : null}
                  </dd>
                  <dd className="order-3 text-small text-muted">{card.note}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <RegionChart region={region} locale={locale} stats={stats} />
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5">
              <RegionAreaCard region={region} locale={locale} />
            </Reveal>
          </div>

          <p className="text-small text-muted">
            <time dateTime={updatedAt}>
              {format(region.yieldEstimate ? t.updatedEstimate : t.updated, { date: formatDate(updatedAt, locale) })}
            </time>
          </p>
        </div>
      </Container>
    </section>
  );
}
