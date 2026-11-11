import { ArrowDown, ArrowRight, BatteryCharging, House, Sun, Zap } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { StepMarker } from "@/components/ui/step-marker";
import { anchors } from "@/content/routes";
import { hybridFlow } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "ses-hybrid-title";

const nodeIcons = { panels: Sun, inverter: Zap, battery: BatteryCharging, house: House } as const;

/** How a hybrid plant works: four nodes, horizontal on desktop, vertical on phones. */
export function SesHybrid() {
  const locale = getLocale();
  const t = getMessages().ses.hybrid;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.sesHybrid}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="ENERGY" tone="dark" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
          />
        </Reveal>

        <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {hybridFlow.map((node, index) => (
            <li
              key={node.id}
              className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-0"
            >
              <Reveal delay={index * 0.08} className="flex flex-1">
                <div
                  className={`flex flex-1 flex-col gap-3 rounded-3xl p-card-sm lg:p-card ${node.highlight ? "bg-white text-ink" : "bg-white/8 text-white"}`}
                >
                  <StepMarker
                    index={index}
                    icon={nodeIcons[node.id]}
                    tone={node.highlight ? "light" : "dark"}
                  />
                  <Heading
                    as="h3"
                    size="h3"
                    className={node.highlight ? "text-ink" : "text-white"}
                  >
                    {node.title[locale]}
                  </Heading>
                  <p
                    className={`text-base leading-relaxed ${node.highlight ? "text-ink/70" : "text-white/75"}`}
                  >
                    {node.text[locale]}
                  </p>
                </div>
              </Reveal>
              {index < hybridFlow.length - 1 ? (
                <span
                  aria-hidden
                  className="flex items-center justify-center text-white/75 lg:px-3"
                >
                  <ArrowDown className="size-5 lg:hidden" />
                  <ArrowRight className="hidden size-5 lg:block" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </Panel>
  );
}
