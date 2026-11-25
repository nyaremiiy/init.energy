import { CalendarClock, Sun } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { InlineLink } from "@/components/ui/inline-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { updatedAt } from "@/content/backup";
import { regionPath, type InsolationRegion } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { backupLocalLead, backupScheduleText, backupSolarText } from "@/lib/backup-region-copy";
import { formatMonthYear } from "@/lib/format";
import { format } from "@/lib/messages";

import { RegionAreaCard } from "../regions/region-yield";

const titleId = "backup-region-local-title";

/** The region's centre in Latin letters for the watermark («LVIV»), as on the mockup. */
const watermark = (region: InsolationRegion) => region.center.en.toUpperCase();

/**
 * «Резервне живлення {в області}»: the direct answer about outage schedules,
 * where we work (the same card as on the solar region page), the grid
 * operator's schedules and the region's solar page.
 */
export function BackupRegionLocal({ region }: { region: InsolationRegion }) {
  const locale = getLocale();
  const t = getMessages().backupRegionPage.local;
  const operator = region.gridOperator;

  return (
    <section aria-labelledby={titleId} className="relative overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text={watermark(region)} side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={region.name[locale]}
            title={format(t.title, { locative: region.locative[locale] })}
            titleId={titleId}
            lead={backupLocalLead(region, locale)}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <RegionAreaCard
              region={region}
              locale={locale}
              text={{ region: t.areaText, city: t.areaTextCity }}
              location="backup_region_page"
            />
          </Reveal>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <Reveal delay={0.06} className="flex-1">
              <article className="flex h-full flex-col items-start gap-4 rounded-card bg-surface p-card-sm lg:p-card">
                <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-white text-ink">
                  <CalendarClock className="size-5" />
                </span>
                <Heading as="h3" size="h3" className="text-ink">
                  {t.schedule.title}
                </Heading>
                <p className="text-body text-muted">{backupScheduleText(region, locale)}</p>
                {operator?.url ? (
                  <InlineLink href={operator.url}>{format(t.schedule.operatorLink, { operator: operator.name[locale] })}</InlineLink>
                ) : null}
                <ArrowLink href={`${localizePath(routes.calculators.sesPayback, locale)}#${anchors.calculator}`} className="mt-auto">
                  {t.schedule.link}
                </ArrowLink>
              </article>
            </Reveal>
            <Reveal delay={0.12} className="flex-1">
              <article className="flex h-full flex-col items-start gap-4 rounded-card bg-sky p-card-sm lg:p-card">
                <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-white text-ink">
                  <Sun className="size-5" />
                </span>
                <Heading as="h3" size="h3" className="text-ink">
                  {t.solar.title}
                </Heading>
                <p className="text-body text-muted">{backupSolarText(region, locale)}</p>
                <ArrowLink href={localizePath(regionPath(region), locale)} wrap className="mt-auto">
                  {format(t.solar.link, { locative: region.locative[locale] })}
                </ArrowLink>
              </article>
            </Reveal>
          </div>
        </div>

        <p className="text-small text-muted">
          <time dateTime={updatedAt}>{format(t.updated, { date: formatMonthYear(updatedAt, locale) })}</time>
        </p>
      </Container>
    </section>
  );
}
