import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { anchors } from "@/content/routes";
import { getMessages } from "@/i18n/server";

const titleId = "calculator-title";

/** Server section; the calculator itself is one client component. */
export function CalculatorSection() {
  const messages = getMessages();
  const t = messages.calculator;

  return (
    <Panel
      as="section"
      variant="sky"
      id={anchors.calculator}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="SYSTEM" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm lg:gap-section-head py-panel-y-sm lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
          />
        </Reveal>
        <QuickCalculator />
      </Container>
    </Panel>
  );
}
