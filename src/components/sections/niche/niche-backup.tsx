import { ProductLink } from "@/components/calculator/calculator-result-parts";
import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { products, productSummary } from "@/content/products";
import { anchors } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

import { nicheIcons } from "./niche-ui";

const titleId = "niche-backup-title";

/** «Keeps running through outages»: priority loads, plant modes (hybrid highlighted) and batteries. */
export function NicheBackup({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const messages = getMessages();
  const t = messages.nichePage;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.nicheBackup}
      aria-labelledby={titleId}
      className="scroll-mt-28 pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="BACKUP" side="right" tone="dark" />
      <Container inPanel className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader tone="dark" eyebrow={t.eyebrows.backup} title={page.backup.title[locale]} titleId={titleId} lead={page.backup.lead[locale]} />
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-5 lg:col-span-6">
            <h3 className="font-heading text-h3-sm font-medium text-white sm:text-h3">{t.prioritiesTitle}</h3>
            <ul className="grid grid-cols-1 border-b border-white/16 sm:grid-cols-2 sm:gap-x-8">
              {page.backup.priorities.map((item) => {
                const Icon = nicheIcons[item.icon];
                return (
                  <li key={item.label.en} className="flex items-center gap-3 border-t border-white/16 py-4 text-base text-white">
                    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25">
                      <Icon className="size-4.5" strokeWidth={1.7} />
                    </span>
                    {item.label[locale]}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-5 lg:col-span-6">
            <h3 className="font-heading text-h3-sm font-medium text-white sm:text-h3">{t.modesTitle}</h3>
            <ul className="flex flex-col gap-3">
              {page.backup.modes.map((mode) => (
                <li
                  key={mode.title.en}
                  className={`flex flex-col gap-1 rounded-3xl p-card-sm ${mode.highlight ? "bg-white text-ink" : "bg-white/8 text-white"}`}
                >
                  <p className="flex flex-wrap items-center gap-3 font-heading text-base font-semibold">
                    {mode.title[locale]}
                    {mode.highlight ? (
                      <span className="rounded-full bg-sky px-3 py-1 font-sans text-xs font-medium text-ink">{t.recommended}</span>
                    ) : null}
                  </p>
                  <p className={`text-sm ${mode.highlight ? "text-ink/70" : "text-white/75"}`}>{mode.text[locale]}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-4">
          <h3 className="font-heading text-h3-sm font-medium text-white sm:text-h3">{t.productsTitle}</h3>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {page.backup.products.map((id) => {
              const product = products[id];
              return (
                <li key={id}>
                  <ProductLink
                    href={localizePath(product.href, locale)}
                    image={product.image}
                    kind={t.productKind}
                    title={product.name}
                    text={productSummary(id, locale)}
                    label={format(messages.sesPayback.productLink, { name: product.name })}
                  />
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Panel>
  );
}
