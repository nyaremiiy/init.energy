import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { RowLink } from "@/components/ui/row-link";
import { backupRegionPath, type InsolationRegion } from "@/content/insolation";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

/** Full-width strip on a solar region page to the backup power page of the same region. */
export function RegionBackupLink({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().regionPage.backupLink;

  return (
    <div className="pt-4">
      <Container>
        <Reveal>
          <div className="rounded-card bg-sky px-card-sm lg:px-card">
            <RowLink
              href={localizePath(backupRegionPath(region), locale)}
              title={format(t.title, { locative: region.locative[locale] })}
              description={t.text}
              bordered={false}
            />
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
