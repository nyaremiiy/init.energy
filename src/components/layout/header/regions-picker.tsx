import { ArrowLink } from "@/components/ui/arrow-link";
import { offices } from "@/content/company";
import { backupRegionPath, insolationRegions, regionPath, type InsolationRegion } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { RegionMenuLink } from "./region-menu-link";
import { RegionsSwitch, type RegionsDirection } from "./regions-switch";

/** All 26 regions in the alphabetical order of the locale (uk: the order of the data). */
function sortedRegions(locale: Locale): InsolationRegion[] {
  return locale === "uk"
    ? insolationRegions
    : insolationRegions.toSorted((a, b) => a.shortName.en.localeCompare(b.shortName.en, "en"));
}

/** «у Львові й Києві»: the office cities from company.ts, the preposition once. */
function officePlaces(locale: Locale, and: string): string {
  const places = offices
    .map((office) => insolationRegions.find((region) => region.office === office.id)?.centerLocative[locale])
    .filter((place): place is string => Boolean(place));
  return places.map((place, index) => (index === 0 ? place : place.replace(/^(у|в|in)\s+/, ""))).join(` ${and} `);
}

const paths: Record<RegionsDirection, (region: InsolationRegion) => string> = {
  solar: regionPath,
  backup: backupRegionPath,
};

/**
 * «Регіони»: links to the 52 region pages (solar and backup), rendered on the
 * server so every address is in the HTML of every page. `panel` — the desktop
 * dropdown (title, 3 columns, footer); `mobile` — the mobile-menu section.
 */
export function RegionsPicker({ variant }: { variant: "panel" | "mobile" }) {
  const locale = getLocale();
  const t = getMessages().chrome.header.regions;
  const regions = sortedRegions(locale);
  const mobile = variant === "mobile";

  const list = (direction: RegionsDirection) => (
    <nav aria-label={direction === "solar" ? t.solarNav : t.backupNav}>
      <ul className={`gap-x-2 ${mobile ? "columns-2" : "columns-3"}`}>
        {regions.map((region) => (
          <li key={region.slug} className="break-inside-avoid">
            <RegionMenuLink
              href={localizePath(paths[direction](region), locale)}
              slug={region.slug}
              name={region.shortName[locale]}
              officeLabel={region.office ? t.office : undefined}
              compact={mobile}
            />
          </li>
        ))}
      </ul>
    </nav>
  );

  const labels = { switch: t.switchLabel, solar: t.solar, backup: t.backup };
  const lists = { solar: list("solar"), backup: list("backup") };

  if (mobile) {
    return <RegionsSwitch labels={labels} lists={lists} fullWidth panelClassName="pt-3" />;
  }

  const hubs: Record<RegionsDirection, string> = {
    solar: localizePath(`${routes.services.turnkeySes}#${anchors.sesRegions}`, locale),
    backup: localizePath(`${routes.backup.hub}#${anchors.backupRegions}`, locale),
  };
  const footer = (direction: RegionsDirection) => (
    <div className="flex items-center justify-between gap-6 bg-surface px-6 py-4">
      <p className="text-small text-muted">{format(t.footer, { places: officePlaces(locale, t.and) })}</p>
      <ArrowLink href={hubs[direction]} className="shrink-0 text-small">
        {t.mapLink}
      </ArrowLink>
    </div>
  );

  return (
    <RegionsSwitch
      labels={labels}
      lists={lists}
      footers={{ solar: footer("solar"), backup: footer("backup") }}
      panelClassName="px-3 pb-4"
      heading={
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-lead leading-snug font-medium text-ink">{t.title}</p>
          <p className="text-caption text-muted">{t.lead}</p>
        </div>
      }
    />
  );
}
