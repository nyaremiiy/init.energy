import { ArrowDown, ArrowRight, Plug, Power, RefreshCw } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { RowLink } from "@/components/ui/row-link";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { StepMarker } from "@/components/ui/step-marker";
import { backupFlow } from "@/content/backup";
import { anchors, routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "backup-how-title";
const stepIcons = { grid: Plug, outage: Power, restored: RefreshCw } as const;

/** How backup power works: grid → outage → grid back, then a link to the solar hub. */
export function BackupHow() {
  const locale = getLocale();
  const t = getMessages().backup.how;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.backupHow}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="POWER" side="right" tone="dark" />
      <Container inPanel className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader tone="dark" eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
        </Reveal>

        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            {backupFlow.map((step, index) => (
              <li key={step.id} className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-0">
                <Reveal delay={index * 0.08} className="flex flex-1">
                  <div className={`flex flex-1 flex-col gap-3 rounded-card p-card-sm lg:p-card ${step.highlight ? "bg-white text-ink" : "bg-fill-dark text-white"}`}>
                    <StepMarker index={index} icon={stepIcons[step.id]} tone={step.highlight ? "light" : "dark"} />
                    <Heading as="h3" size="h3" className={step.highlight ? "text-ink" : "text-white"}>
                      {step.title[locale]}
                    </Heading>
                    <p className={`text-body leading-relaxed ${step.highlight ? "text-muted" : "text-muted-dark"}`}>{step.text[locale]}</p>
                  </div>
                </Reveal>
                {index < backupFlow.length - 1 ? (
                  <span aria-hidden className="flex items-center justify-center text-muted-dark lg:px-3">
                    <ArrowDown className="size-5 lg:hidden" />
                    <ArrowRight className="hidden size-5 lg:block" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="rounded-card bg-fill-dark px-card-sm lg:px-card">
              <RowLink tone="dark" href={localizePath(routes.services.turnkeySes, locale)} title={t.solarTitle} description={t.solarText} bordered={false} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Panel>
  );
}
