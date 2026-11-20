import { PillLink } from "@/components/ui/pill-link";
import { regionPath, regionsByShortName } from "@/content/insolation";
import { localizePath, type Locale } from "@/i18n/config";

/** Pills to every region page (alphabetical by the short name), optionally without the current one. */
export function RegionPills({ locale, exclude, label }: { locale: Locale; exclude?: string; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {regionsByShortName(locale)
          .filter((region) => region.id !== exclude)
          .map((region) => (
            <li key={region.id}>
              <PillLink size="compact" href={localizePath(regionPath(region), locale)}>
                {region.shortName[locale]}
              </PillLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
