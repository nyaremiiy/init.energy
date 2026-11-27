import { BatteryCharging, BatteryFull, Cable, Sun, Unplug, Upload, Users, ZapOff, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors } from "@/content/routes";
import { plantRows, plantTypes, type PlantRowId, type PlantTypeId } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "ses-types-title";

const columnIcons: Record<PlantTypeId, LucideIcon> = { grid: Cable, hybrid: Sun, off: BatteryFull };
const rowIcons: Record<PlantRowId, LucideIcon> = {
  outage: ZapOff,
  battery: BatteryCharging,
  export: Upload,
  dependence: Unplug,
  fits: Users,
};

/** Grid-tied, hybrid (recommended) and off-grid plants — on the shared ComparisonTable, like the backup hub. */
export function SesPlantTypes() {
  const locale = getLocale();
  const t = getMessages().ses.types;

  return (
    <Panel as="section" variant="light" id={anchors.sesTypes} aria-labelledby={titleId} className="scroll-mt-40 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
        </Reveal>
        <Reveal>
          {/* TODO(content): link «Детальніше: мережева чи гібридна СЕС» to the knowledge-base article once it exists. */}
          <ComparisonTable
            caption={t.caption}
            featureLabel={t.feature}
            columns={plantTypes.map((type) => ({
              id: type.id,
              label: type.label[locale],
              icon: columnIcons[type.id],
              highlight: type.highlight,
            }))}
            rows={plantRows.map((row) => ({
              id: row.id,
              label: row.label[locale],
              icon: rowIcons[row.id],
              cells: Object.fromEntries(
                Object.entries(row.cells).map(([id, cell]) => [id, { status: cell.status, text: cell.text[locale] }]),
              ),
            }))}
          />
        </Reveal>
      </Container>
    </Panel>
  );
}
