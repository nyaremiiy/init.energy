import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors, routes } from "@/content/routes";
import { messages } from "@/lib/messages";

const titleId = "calculator-title";

/** Server section; the calculator itself is one client component. */
export function CalculatorSection() {
  const t = messages.calculator;

  return (
    <Panel
      as="section"
      variant="sky"
      id={anchors.calculator}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head py-section-sm lg:py-section">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={
              <ArrowLink href={routes.calculatorPayback}>
                {t.paybackLink}
              </ArrowLink>
            }
          />
        </Reveal>
        <QuickCalculator />
      </Container>
    </Panel>
  );
}
