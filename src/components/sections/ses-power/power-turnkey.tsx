import { ArrowUpRight, Check, ClipboardList, FileText, Leaf, LifeBuoy, PanelsTopLeft, Wrench, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StepMarker } from "@/components/ui/step-marker";
import { anchors } from "@/content/routes";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "power-turnkey-title";

/** Icons of the six steps, in the order of `messages.sesPower.turnkey.steps`. */
const stepIcons: LucideIcon[] = [ClipboardList, FileText, PanelsTopLeft, Wrench, Leaf, LifeBuoy];

/**
 * «Що входить у СЕС 5 кВт під ключ»: a dark panel with six cards (number +
 * icon), then what the price depends on and the loan card. No prices (owner).
 */
export function PowerTurnkey({ kw, locale }: { kw: number; locale: Locale }) {
  const t = getMessages().sesPower.turnkey;
  const kwText = formatNumber(kw, locale);

  return (
    <Panel as="section" variant="dark" panelClassName="bg-ink-glow" id={anchors.powerTurnkey} aria-labelledby={titleId} className="scroll-mt-28 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader tone="dark" eyebrow={t.eyebrow} title={format(t.title, { kw: kwText })} titleId={titleId} lead={t.lead} />
        </Reveal>

        <div className="flex flex-col gap-4">
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.steps.map((step, index) => (
              <li key={step.title} className="flex">
                <Reveal delay={index * 0.05} className="flex flex-1">
                  <div className="flex flex-1 flex-col gap-3 rounded-card border border-line-dark bg-fill-dark p-card-sm transition-transform duration-200 ease-tech motion-safe:hover:-translate-y-1 lg:p-card">
                    <StepMarker index={index} icon={stepIcons[index]} tone="dark" />
                    <Heading as="h3" size="h3" className="mt-2 text-white">
                      {step.title}
                    </Heading>
                    <p className="text-body leading-relaxed text-muted-dark">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Reveal className="flex lg:col-span-7">
              <div className="flex flex-1 flex-col gap-4 rounded-card border border-line-dark bg-fill-dark p-card-sm lg:p-card">
                <Heading as="h3" size="h3" className="text-white">
                  {t.priceTitle}
                </Heading>
                <p className="text-body text-muted-dark">{format(t.priceLead, { kw: kwText })}</p>
                <ul className="flex flex-col gap-2">
                  {t.priceItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body text-white">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-muted-dark" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="flex lg:col-span-5">
              <div className="flex flex-1 flex-col items-start gap-4 rounded-card bg-white p-card-sm text-ink lg:p-card">
                <Heading as="h3" size="h3" className="text-ink">
                  {t.creditTitle}
                </Heading>
                <p className="text-body text-muted">{t.creditText}</p>
                <Button href={`#${anchors.contacts}`} variant="dark" className="mt-auto" icon={<ArrowUpRight aria-hidden className="size-4.5" />}>
                  {t.creditCta}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Panel>
  );
}
