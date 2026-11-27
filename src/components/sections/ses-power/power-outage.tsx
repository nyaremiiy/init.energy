import { ArrowUpRight, BatteryCharging } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { appliances } from "@/content/appliances";
import { anchors, routes } from "@/content/routes";
import { usableShare } from "@/content/storage";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import { powerLoadSets, type PowerFacts } from "@/lib/ses-power-facts";

import { PowerAppliances } from "./power-appliances";

const titleId = "power-outage-title";

/**
 * «СЕС 5 кВт під час відключень світла»: why long outages need a battery
 * (neutral wording, SVIT only next to other brands) and the appliance picker
 * with hours for a ≈ 5 and a ≈ 16 kWh battery.
 */
export function PowerOutage({ facts, locale }: { facts: PowerFacts; locale: Locale }) {
  const messages = getMessages();
  const t = messages.sesPower.outage;
  const { small, big } = facts.batteries;

  return (
    <Panel as="section" variant="dark" panelClassName="bg-ink-glow" id={anchors.powerOutage} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container inPanel className="grid grid-cols-1 gap-section-head-sm py-panel-y-sm lg:grid-cols-12 lg:gap-10 lg:py-panel-y">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Reveal>
            <SectionHeader tone="dark" eyebrow={t.eyebrow} title={format(t.title, { kw: formatNumber(facts.kw, locale) })} titleId={titleId} lead={t.lead} />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex flex-col items-start gap-4 rounded-card bg-white p-card-sm text-ink lg:p-card">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-full border border-line text-ink">
                <BatteryCharging className="size-5" strokeWidth={1.7} />
              </span>
              <Heading as="h3" size="h3" className="text-ink">
                {t.batteryTitle}
              </Heading>
              <p className="text-body leading-relaxed text-muted">{t.batteryText}</p>
              <Button
                href={`${localizePath(routes.calculators.sesPayback, locale)}#${anchors.calculator}`}
                variant="dark"
                icon={<ArrowUpRight aria-hidden className="size-4.5" />}
              >
                {t.batteryCta}
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <PowerAppliances
            appliances={appliances.map((item) => ({ id: item.id, name: item.name[locale], powerW: item.powerW }))}
            sets={powerLoadSets.map((set) => ({ id: set.id, label: t.sets[set.id], appliances: set.appliances }))}
            defaultSet="fridge"
            batteries={[
              { kwh: small.roundedKwh, capacityWh: small.capacityWh },
              { kwh: big.roundedKwh, capacityWh: big.capacityWh },
            ]}
            usableShare={usableShare}
            labels={{
              pickLead: t.pickLead,
              setsLabel: t.setsLabel,
              appliancesLabel: t.appliancesLabel,
              total: t.total,
              battery: t.battery,
              hours: t.hours,
              none: t.none,
              summary: t.summary,
              unitW: messages.units.W,
            }}
          />
          <p className="mt-4 text-caption text-muted-dark">{t.note}</p>
        </Reveal>
      </Container>
    </Panel>
  );
}
