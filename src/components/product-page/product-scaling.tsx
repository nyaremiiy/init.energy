import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import type { ProductPage } from "@/content/product-pages";
import { anchors } from "@/content/routes";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";

import { ScalingWidget } from "./scaling-widget";

const titleId = "product-scaling-title";

export function ProductScaling({
  page,
  name,
  locale,
}: {
  page: ProductPage;
  name: string;
  locale: Locale;
}) {
  const messages = getMessages();
  const t = messages.productPage.scaling;
  const scaling = page.scaling;
  if (!scaling) return null;

  return (
    <Panel
      as="section"
      variant="dark"
      id={anchors.scaling}
      aria-labelledby={titleId}
      className="scroll-mt-40 bg-white pt-section-sm lg:pt-section"
      panelClassName="bg-ink-glow"
    >
      <SectionWatermark text="SCALE" tone="dark" />
      <Container
        inPanel
        className="relative flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y"
      >
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow={t.eyebrow}
            title={scaling.title[locale]}
            titleId={titleId}
            lead={scaling.lead[locale]}
          />
        </Reveal>
        <ScalingWidget
          name={name}
          moduleCapacityKwh={scaling.moduleCapacityKwh}
          options={scaling.options}
          defaultModules={scaling.defaultModules}
          labels={{
            legend: t.legend,
            option: t.option,
            caption: t.caption,
            approx: t.approx,
            note: t.note,
            tilesLabel: t.tilesLabel,
            unit: messages.units.kWh,
          }}
        />
      </Container>
    </Panel>
  );
}
