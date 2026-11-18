import { ArrowUpRight, BatteryCharging, Check, PlugZap } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { backupBrands, svitLine } from "@/content/backup";
import { products } from "@/content/products";
import { anchors, sectionHref } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";
import { formatQuantity } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "backup-equipment-title";

/**
 * Equipment we install: the SVIT line (INIT ENERGY's own brand) and Deye /
 * Victron / Huawei systems as text. «Own production» and «warranty from the
 * manufacturer» are not shown for the whole line (TODO(content), see content/backup.ts).
 */
export function BackupEquipment() {
  const locale = getLocale();
  const t = getMessages().backup.equipment;
  const first = products[svitLine[0]];
  const last = products[svitLine[svitLine.length - 1]];

  return (
    <Panel as="section" variant="light" id={anchors.backupEquipment} aria-labelledby={titleId} className="scroll-mt-40 pt-section-sm lg:pt-section">
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <article className="flex h-full flex-col items-start gap-6 rounded-card bg-ink p-card-sm text-white lg:p-card">
              <CardLabel tone="dark" icon={BatteryCharging}>
                {t.svitLabel}
              </CardLabel>
              <div className="flex flex-col gap-3">
                <Heading as="h3" size="h2" className="text-white">
                  SVIT
                </Heading>
                <p className="text-body leading-relaxed text-muted-dark">
                  {format(t.svitText, { min: formatQuantity(first.capacity, locale), max: formatQuantity(last.capacity, locale) })}
                </p>
              </div>
              <ul aria-label={t.svitListLabel} className="flex flex-col gap-2 text-small">
                {svitLine.map((id) => (
                  <li key={id} className="flex items-center gap-2.5">
                    <Check aria-hidden size={16} strokeWidth={2} className="shrink-0" />
                    <span>
                      {products[id].name} <span className="text-muted-dark">· {formatQuantity(products[id].capacity, locale)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button href={sectionHref(anchors.products, locale)} variant="primary" className="mt-auto" icon={<ArrowUpRight aria-hidden className="size-4.5" />}>
                {t.svitLink}
              </Button>
            </article>
          </Reveal>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
            {backupBrands.map((brand, index) => (
              <li key={brand}>
                <Reveal delay={0.06 + index * 0.06} className="h-full">
                  <article className="flex h-full min-h-56 flex-col items-start gap-4 rounded-card bg-white p-card-sm">
                    <Heading as="h3" size="h3">
                      {brand}
                    </Heading>
                    <CardLabel icon={PlugZap}>{t.brandLabel}</CardLabel>
                    <p className="mt-auto text-small text-muted">{t.brandText}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Panel>
  );
}
