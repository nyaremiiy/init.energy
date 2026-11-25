import { PillLink } from "@/components/ui/pill-link";
import { backupRegionPath, regionPath, regionsByShortName } from "@/content/insolation";
import { localizePath, type Locale } from "@/i18n/config";

/** Which region pages the pills lead to: solar (/cec/{region}/) or backup power (/rezervne-zhyvlennya/{region}/). */
export type RegionPageKind = "solar" | "backup";

const pathFor = { solar: regionPath, backup: backupRegionPath } as const;

/** Pills to every region page (alphabetical by the short name), optionally without the current one. */
export function RegionPills({
  locale,
  exclude,
  label,
  kind = "solar",
}: {
  locale: Locale;
  exclude?: string;
  label: string;
  kind?: RegionPageKind;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {regionsByShortName(locale)
          .filter((region) => region.id !== exclude)
          .map((region) => (
            <li key={region.id}>
              <PillLink size="compact" href={localizePath(pathFor[kind](region), locale)}>
                {region.shortName[locale]}
              </PillLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
