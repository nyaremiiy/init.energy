import { Sun } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { InlineLink } from "@/components/ui/inline-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { nationwideService } from "@/content/company";
import { insolationRegions, regionPath } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { ukraineMap } from "@/content/ukraine-map";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { mapBucket, mapThresholds, roundMonth, roundYear, stationYear } from "@/lib/calc/region-yield";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { leastSunnyRegion, nationalStationYear, regionSpreadPercent, sunniestRegion } from "@/lib/region-stats";

import { RegionMapHover } from "./region-map-hover";
import { RegionPills } from "./region-pills";

const titleId = "ses-regions-title";

/** Five steps of the map scale (globals.css `--color-scale-*`), light → strong. */
const scaleFills = ["fill-scale-1", "fill-scale-2", "fill-scale-3", "fill-scale-4", "fill-scale-5"] as const;
const scaleSwatches = ["bg-scale-1", "bg-scale-2", "bg-scale-3", "bg-scale-4", "bg-scale-5"] as const;

const regionsByMapId = new Map(insolationRegions.map((region) => [region.mapId, region]));

/**
 * «Сонячні панелі у вашій області» on /cec/: a choropleth of Ukraine where
 * every region links to its page, the south / average / west figures and the
 * list of regions. Numbers come from content/insolation.ts.
 */
export function SesRegions() {
  const locale = getLocale();
  const t = getMessages().sesRegions;
  const units = getMessages().units;
  const n = (value: number) => formatNumber(value, locale);
  const south = roundYear(stationYear(sunniestRegion.yield));
  const west = roundYear(stationYear(leastSunnyRegion.yield));
  // «майже на третину» while the spread is close to a third; the exact percent otherwise.
  const spread = regionSpreadPercent >= 28 && regionSpreadPercent <= 33 ? t.spreadThird : format(t.spreadPercent, { pct: n(regionSpreadPercent) });
  const legend = [
    format(t.legendUpTo, { value: n(mapThresholds[0]) }),
    ...mapThresholds.slice(0, -1).map((from, index) => `${n(from)}–${n(mapThresholds[index + 1])}`),
    format(t.legendOver, { value: n(mapThresholds[mapThresholds.length - 1]) }),
  ];
  const stats = [
    { label: t.south, value: n(south), note: sunniestRegion.name[locale] },
    { label: t.average, value: `≈ ${n(nationalStationYear)}`, note: format(t.averageNote, { count: String(insolationRegions.length) }) },
    { label: t.west, value: n(west), note: leastSunnyRegion.name[locale] },
  ];

  return (
    <section id={anchors.sesRegions} aria-labelledby={titleId} className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="REGIONS" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={format(t.lead, { max: n(south), min: n(west) })}
            aside={<ArrowLink href={`#${anchors.calculator}`}>{t.link}</ArrowLink>}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <div className="flex flex-col gap-8 rounded-card bg-surface p-card-sm lg:p-card">
              <div className="flex flex-col gap-2">
                <Heading as="h3" size="h3" weight="semibold" className="text-ink">
                  {t.mapTitle}
                </Heading>
                <p className="text-body text-muted">{spread}</p>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1 border-l border-line pl-4">
                    <dt className="text-small text-muted">{stat.label}</dt>
                    <dd className="flex items-baseline gap-1.5 font-heading text-stat font-light whitespace-nowrap text-ink tabular-nums sm:text-h2-sm">
                      {stat.value}
                      <span className="font-sans text-caption font-normal text-muted">{units.kWh}</span>
                    </dd>
                    <dd className="text-small text-muted">{stat.note}</dd>
                  </div>
                ))}
              </dl>

              <RegionMapHover>
                <svg viewBox={ukraineMap.viewBox} role="group" aria-label={t.mapLabel} className="h-auto w-full">
                  {ukraineMap.locations.map((location) => {
                    const region = regionsByMapId.get(location.id);
                    if (!region) return null;
                    const year = stationYear(region.yield);
                    const values = { year: n(roundYear(year)), month: n(roundMonth(year / 12)) };
                    return (
                      <a
                        key={location.id}
                        href={localizePath(regionPath(region), locale)}
                        aria-label={format(t.regionLabel, { name: region.name[locale], year: values.year })}
                        data-region={region.id}
                        data-name={region.name[locale]}
                        data-text={format(t.tooltip, values)}
                        data-link={t.tooltipLink}
                        className="group focus:outline-none"
                      >
                        <path
                          d={location.path}
                          className={`${scaleFills[mapBucket(year)]} stroke-white stroke-1 transition-colors duration-150 ease-tech group-hover:fill-ink group-focus-visible:fill-ink`}
                        />
                      </a>
                    );
                  })}
                </svg>
              </RegionMapHover>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-muted">
                  <span className="font-medium text-ink">{t.legendTitle}</span>
                  {legend.map((label, index) => (
                    <span key={label} className="inline-flex items-center gap-2">
                      <span aria-hidden className={`size-3 rounded-full ${scaleSwatches[index]}`} />
                      {label}
                    </span>
                  ))}
                </div>
                {/* Required attribution: @svg-maps/ukraine is based on MapSVG, CC BY 4.0. */}
                <p className="text-caption text-muted">
                  {t.attribution} <InlineLink href="https://mapsvg.com">MapSVG</InlineLink>,{" "}
                  <InlineLink href="https://creativecommons.org/licenses/by/4.0/">{t.license}</InlineLink>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <Heading as="h3" size="h3" weight="semibold" className="text-ink">
                {t.listTitle}
              </Heading>
              <p className="text-body text-muted">{t.listText}</p>
            </div>
            <RegionPills locale={locale} label={t.listTitle} />
            <div className="flex items-start gap-4 rounded-card bg-sky p-card-sm lg:p-card">
              <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                <Sun className="size-5" />
              </span>
              <div className="flex flex-col items-start gap-2">
                <p className="font-heading text-body font-semibold text-ink">{nationwideService.text[locale]}</p>
                <p className="text-body text-muted">{format(t.cardText, { pct: n(regionSpreadPercent) })}</p>
                <ArrowLink href={`#${anchors.contacts}`}>{t.cardLink}</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
