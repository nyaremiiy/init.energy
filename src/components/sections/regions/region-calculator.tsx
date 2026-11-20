import { SesPaybackCalculator } from "@/components/calculator/ses-payback-calculator";
import { SesPaybackProvider } from "@/components/calculator/ses-payback-state";
import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { InsolationRegion } from "@/content/insolation";
import { anchors, routes } from "@/content/routes";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const titleId = "region-calculator-title";

/**
 * The payback calculator with the page's region preselected (it counts as
 * chosen for the lead, source «page»). Nothing is written to the URL.
 */
export function RegionCalculator({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().regionPage.calculator;

  return (
    <Panel
      as="section"
      variant="light"
      id={anchors.calculator}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container inPanel className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={format(t.lead, { name: region.name[locale] })}
            aside={<ArrowLink href={localizePath(routes.calculators.sesPayback, locale)}>{t.link}</ArrowLink>}
          />
        </Reveal>
        <Reveal delay={0.08} distance={16}>
          <SesPaybackProvider regionId={region.id}>
            <SesPaybackCalculator />
          </SesPaybackProvider>
        </Reveal>
      </Container>
    </Panel>
  );
}
