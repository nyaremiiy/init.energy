import { ArrowUpRight, BatteryCharging, Cpu, Sun, Wrench, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { StepMarker } from "@/components/ui/step-marker";
import { offerExistingSystems } from "@/content/backup";
import { partnerBrandNames } from "@/content/partner-brands";
import { products } from "@/content/products";
import { anchors } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";
import { formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "backup-choice-title";

/**
 * «Підберемо найкраще рішення, а не лише своє» (owner 2026-11-25: we make SVIT
 * but take on any system). Three steps and four options; capacities come from
 * products.ts. The «already have a system» card follows `offerExistingSystems`.
 */
export function BackupChoice() {
  const locale = getLocale();
  const t = getMessages().backupRegionPage.choice;
  const c = t.cards;

  const cards: { id: string; icon: LucideIcon; label: string; title: string; text: string }[] = [
    {
      id: "svit",
      icon: BatteryCharging,
      label: c.svit.label,
      title: c.svit.title,
      text: format(c.svit.text, {
        small: products.svit600.name,
        smallCapacity: formatQuantity(products.svit600.capacity, locale),
        big: products.svitPlus16000.name,
        bigCapacity: formatQuantity(products.svitPlus16000.capacity, locale),
      }),
    },
    { id: "brands", icon: Cpu, label: c.brands.label, title: partnerBrandNames, text: c.brands.text },
    { id: "solar", icon: Sun, label: c.solar.label, title: c.solar.title, text: c.solar.text },
    ...(offerExistingSystems ? [{ id: "existing", icon: Wrench, label: c.existing.label, title: c.existing.title, text: c.existing.text }] : []),
  ];

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.backupChoice}
      aria-labelledby={titleId}
      className="scroll-mt-28 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <Container inPanel className="grid grid-cols-1 gap-section-head-sm py-panel-y-sm lg:grid-cols-12 lg:gap-16 lg:py-panel-y">
        <Reveal className="flex flex-col items-start gap-8 lg:col-span-5">
          <SectionHeader tone="dark" eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
          <ol aria-label={t.stepsLabel} className="w-full border-t border-line-dark">
            {t.steps.map((step, index) => (
              <li key={step} className="flex gap-5 border-b border-line-dark py-4 text-body text-white">
                <span aria-hidden className="font-heading text-small font-medium text-muted-dark tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Button href={`#${anchors.contacts}`} variant="primary" icon={<ArrowUpRight aria-hidden className="size-4.5" />}>
            {t.cta}
          </Button>
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {cards.map((card, index) => (
            <li key={card.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <article className="flex h-full flex-col gap-4 rounded-card border border-line-dark bg-fill-dark p-card-sm text-white lg:p-card">
                  <StepMarker index={index} icon={card.icon} tone="dark" />
                  <p className="mt-4 font-heading text-eyebrow-sm font-medium tracking-eyebrow text-muted-dark uppercase sm:text-eyebrow">
                    {card.label}
                  </p>
                  <Heading as="h3" size="h3" className="-mt-2 text-white">
                    {card.title}
                  </Heading>
                  <p className="text-body leading-relaxed text-muted-dark">{card.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Panel>
  );
}
