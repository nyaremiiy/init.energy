import { MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ContactLink } from "@/components/ui/contact-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { updatedAt } from "@/content/backup";
import { nationwideService, offices } from "@/content/company";
import { insolationRegions } from "@/content/insolation";
import { anchors } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";
import { formatMonthYear, formatNumber, formatPhone } from "@/lib/format";
import { format } from "@/lib/messages";

import { RegionPills } from "../regions/region-pills";

const titleId = "backup-regions-title";

/**
 * «Резервне живлення у вашій області» on the backup hub: pills to the 26
 * region pages and the offices. No map: there is no backup data to colour it
 * with. Replaces the «by region» block above the footer on this page.
 */
export function BackupRegions() {
  const locale = getLocale();
  const t = getMessages().backup.regions;
  const officeCity = (id: string) => insolationRegions.find((region) => region.office === id)?.centerLocative[locale] ?? "";

  return (
    <section id={anchors.backupRegions} aria-labelledby={titleId} className="scroll-mt-40 pt-section-sm lg:pt-section">
      <Container className="flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="flex h-full flex-col gap-6 rounded-card bg-surface p-card-sm lg:p-card">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Heading as="h3" size="h3" className="text-ink">
                  {t.pickTitle}
                </Heading>
                <span className="text-small text-muted">{format(t.count, { count: formatNumber(insolationRegions.length, locale) })}</span>
              </div>
              <RegionPills locale={locale} label={t.title} kind="backup" />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="flex h-full flex-col gap-5 rounded-card bg-ink-glow p-card-sm text-white lg:p-card">
              <Eyebrow tone="dark">{t.cardLabel}</Eyebrow>
              <Heading as="h3" size="h3" className="text-white">
                {nationwideService.text[locale]}
              </Heading>
              <p className="text-body leading-relaxed text-muted-dark">{t.cardText}</p>
              <ul className="mt-auto flex flex-col gap-2">
                {offices.map((office) => {
                  const label = format(t.office, { centerLocative: officeCity(office.id), address: office.address[locale] });
                  // No phone of its own (Kyiv): the address only, no call button.
                  if (!office.phone) {
                    return (
                      <li key={office.id} className="flex items-center gap-2 px-4 py-2 text-small text-muted-dark">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        {label}
                      </li>
                    );
                  }
                  const phone = formatPhone(office.phone.display);
                  return (
                    <li key={office.id}>
                      <ContactLink
                        href={office.phone.href}
                        method="phone"
                        location="backup_hub_regions"
                        aria-label={format(t.callLabel, { phone })}
                        className="group flex items-center gap-4 rounded-tile bg-fill-dark p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      >
                        <IconButton decorative variant="solid-light" size="sm" icon="phone" className="transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105" />
                        <span className="flex min-w-0 flex-col">
                          <span className="text-caption text-muted-dark">{label}</span>
                          <span className="font-heading text-lead font-semibold whitespace-nowrap tabular-nums">{phone}</span>
                        </span>
                      </ContactLink>
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>
        </div>

        <p className="text-small text-muted">
          <time dateTime={updatedAt}>{format(t.updated, { date: formatMonthYear(updatedAt, locale) })}</time>
        </p>
      </Container>
    </section>
  );
}
