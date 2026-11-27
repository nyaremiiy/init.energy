import { BatteryCharging, BatteryFull, Cable, Moon, Receipt, Sun, Upload, Users, ZapOff } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ComparisonTable, type ComparisonRow, type ComparisonStatus } from "@/components/ui/comparison-table";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors, routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { powerValues } from "@/lib/ses-power-copy";
import type { PowerFacts } from "@/lib/ses-power-facts";

import { PowerDiagram, type PlantType } from "./power-diagram";

const titleId = "power-types-title";

/**
 * «Мережева, гібридна чи з батареєю»: a light panel with the plant diagram
 * (client island) and the shared ComparisonTable, hybrid + battery recommended.
 */
export function PowerTypes({ facts, locale }: { facts: PowerFacts; locale: Locale }) {
  const messages = getMessages().sesPower;
  const t = messages.types;
  const types = messages.calculator.types;
  const values = powerValues(facts, locale);
  const n = (value: number) => formatNumber(value, locale);
  const c = t.cells;
  const cell = (status: ComparisonStatus | undefined, text: string) => ({ status, text });
  const row = (id: keyof typeof t.rows, icon: ComparisonRow["icon"], cells: Record<PlantType, { status?: ComparisonStatus; text: string }>): ComparisonRow => ({
    id,
    label: t.rows[id],
    icon,
    cells,
  });

  return (
    <Panel as="section" variant="light" id={anchors.powerTypes} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={format(t.lead, {
              kw: values.kw,
              capacity: values.small,
              load: values.load,
              hours: values.smallHours,
            })}
            aside={<ArrowLink href={localizePath(routes.backup.hub, locale)}>{t.link}</ArrowLink>}
          />
        </Reveal>

        <Reveal>
          <PowerDiagram
            labels={{
              title: format(t.diagramTitle, { kw: values.kw }),
              desc: t.diagramDesc,
              tabsLabel: t.tabsLabel,
              modesLabel: t.modesLabel,
              types,
              modes: t.modes,
              captions: t.captions,
              nodes: {
                ...t.nodes,
                inverterNote: format(t.nodes.inverterNote, { kw: values.kw }),
                panelsNote: format(t.nodes.panelsNote, values),
                batteryNote: format(t.nodes.batteryNote, { capacity: n(facts.batteries.small.roundedKwh) }),
              },
            }}
          />
        </Reveal>

        <Reveal>
          <ComparisonTable
            caption={t.caption}
            featureLabel={t.feature}
            columns={[
              { id: "grid", label: types.grid, icon: Cable },
              { id: "hybrid", label: types.hybrid, icon: Sun },
              { id: "battery", label: types.battery, icon: BatteryCharging, highlight: true },
            ]}
            rows={[
              row("bill", Receipt, { grid: cell("good", c.yes), hybrid: cell("good", c.yes), battery: cell("good", c.yes) }),
              row("export", Upload, { grid: cell("good", c.yes), hybrid: cell("good", c.yes), battery: cell("good", c.yes) }),
              row("outage", ZapOff, { grid: cell("bad", c.outageGrid), hybrid: cell("limited", c.outageHybrid), battery: cell("good", c.outageBattery) }),
              row("night", Moon, { grid: cell("bad", c.no), hybrid: cell("bad", c.no), battery: cell("good", c.nightBattery) }),
              row("battery", BatteryFull, { grid: cell("bad", c.batteryGrid), hybrid: cell("limited", c.batteryHybrid), battery: cell("good", c.batteryBattery) }),
              row("fits", Users, { grid: cell(undefined, c.fitsGrid), hybrid: cell(undefined, c.fitsHybrid), battery: cell(undefined, c.fitsBattery) }),
            ]}
          />
        </Reveal>
      </Container>
    </Panel>
  );
}
