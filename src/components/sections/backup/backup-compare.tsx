import { ArrowRightLeft, BatteryCharging, Building2, Clock, Fuel, Sun, Volume2, Wrench, Zap, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { backupCompareColumns, backupCompareRows, type CompareColumnId, type CompareRowId } from "@/content/backup";
import { anchors } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "backup-compare-title";

const columnIcons: Record<CompareColumnId, LucideIcon> = { generator: Fuel, ups: BatteryCharging, battery: Zap };
const rowIcons: Record<CompareRowId, LucideIcon> = {
  noise: Volume2,
  switching: ArrowRightLeft,
  runtime: Clock,
  maintenance: Wrench,
  apartment: Building2,
  solar: Sun,
};

/** Generator, UPS or an inverter with a battery — on the shared ComparisonTable. */
export function BackupCompare() {
  const locale = getLocale();
  const t = getMessages().backup.compare;

  return (
    <Panel as="section" variant="light" id={anchors.backupCompare} aria-labelledby={titleId} className="scroll-mt-40 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
        </Reveal>
        <Reveal>
          <ComparisonTable
            caption={t.caption}
            featureLabel={t.feature}
            columns={backupCompareColumns.map((column) => ({
              id: column.id,
              label: column.label[locale],
              icon: columnIcons[column.id],
              highlight: column.highlight,
            }))}
            rows={backupCompareRows.map((row) => ({
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
