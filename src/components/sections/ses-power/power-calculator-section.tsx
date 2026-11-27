import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { solarPlans } from "@/content/calculator";
import { anchors, routes } from "@/content/routes";
import { sesPowerPages, sesPowerPath, type SesPowerPage } from "@/content/ses-power";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatDate, formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";
import type { PowerFacts } from "@/lib/ses-power-facts";

import { PowerCalculator } from "./power-calculator";

const titleId = "power-calculator-title";

/** «Порахуйте СЕС 5 кВт для свого будинку»: the sky panel around the client calculator. */
export function PowerCalculatorSection({ page, facts, locale }: { page: SesPowerPage; facts: PowerFacts; locale: Locale }) {
  const messages = getMessages();
  const t = messages.sesPower.calculator;
  const kw = formatNumber(page.kw, locale);

  return (
    <Panel as="section" variant="sky" id={anchors.calculator} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={format(t.title[page.segment], { kw })} titleId={titleId} lead={t.lead} />
        </Reveal>
        <Reveal>
          <PowerCalculator
            kw={page.kw}
            segment={page.segment}
            consumption={page.consumption}
            defaultRegionId={page.defaultRegionId}
            tariff={facts.tariff.value}
            solarPlans={solarPlans}
            powerPages={sesPowerPages.map((item) => ({ kw: item.kw, href: localizePath(sesPowerPath(item), locale) }))}
            calculatorHref={localizePath(routes.calculators.sesPayback, locale)}
            reserve={{ hours: facts.houseHours.small, load: facts.houseLoad, capacity: facts.batteries.small.roundedKwh }}
            labels={{
              ...t,
              type: t.type,
              tariffHint: format(t.tariffHint, { date: formatDate(facts.tariff.validUntil, locale) }),
              currency: messages.sesPower.figures.currency,
              hours: messages.sesPower.outage.hours,
              months: messages.regionPage.monthsShort,
              units: { kWh: messages.units.kWh, kW: messages.units.kW },
              kwUnitLabel: messages.units.kW,
            }}
          />
        </Reveal>
      </Container>
    </Panel>
  );
}
