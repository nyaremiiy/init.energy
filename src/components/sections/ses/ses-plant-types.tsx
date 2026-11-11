import { Check, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors } from "@/content/routes";
import { plantRows, plantTypes, type PlantTypeId } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "ses-types-title";

/** The hybrid column is highlighted: dark header, white cells. */
const isHybrid = (id: PlantTypeId) => id === "hybrid";

/**
 * Grid-tied, hybrid and off-grid plants compared side by side, without
 * horizontal scroll: on mobile each row is the feature name above three
 * value cells; from md it is a regular four-column table. Explicit ARIA
 * roles keep table semantics on the CSS grid.
 */
export function SesPlantTypes() {
  const locale = getLocale();
  const t = getMessages().ses.types;

  return (
    <Panel
      as="section"
      variant="light"
      id={anchors.sesTypes}
      aria-labelledby={titleId}
      className="scroll-mt-40 pt-section-sm lg:pt-section"
    >
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
          />
        </Reveal>

        <Reveal>
          {/* TODO(content): link «Детальніше: мережева чи гібридна СЕС» to the knowledge-base article once it exists. */}
          <div role="table" aria-label={t.caption} className="text-sm">
            <div role="row" className="grid grid-cols-3 items-end md:grid-cols-4">
              <span role="columnheader" className="sr-only md:not-sr-only">
                <span className="sr-only">{t.feature}</span>
              </span>
              {plantTypes.map((type) => (
                <span
                  key={type.id}
                  role="columnheader"
                  className={`px-3 font-heading text-base font-semibold sm:px-5 ${isHybrid(type.id) ? "rounded-t-2xl bg-ink py-5 text-white" : "py-4 text-ink"}`}
                >
                  <span className="block">{type.label[locale]}</span>
                  {isHybrid(type.id) ? (
                    <span className="mt-1 block font-sans text-xs font-medium text-white/75">
                      {t.recommended}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>

            {plantRows.map((row, rowIndex) => (
              <div
                key={row.label.en}
                role="row"
                className="grid grid-cols-3 border-t border-line md:grid-cols-4"
              >
                <span
                  role="rowheader"
                  className="col-span-3 pt-4 text-ink/70 md:col-span-1 md:flex md:items-center md:py-5 md:pr-4"
                >
                  {row.label[locale]}
                </span>
                {plantTypes.map((type) => {
                  const value = row.values[type.id];

                  return (
                    <span
                      key={type.id}
                      role="cell"
                      className={`flex items-center px-3 py-4 text-ink sm:px-5 md:py-5 ${isHybrid(type.id) ? `bg-white ${rowIndex === plantRows.length - 1 ? "md:rounded-b-2xl" : ""}` : ""}`}
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-ink text-white">
                            <Check aria-hidden className="size-3.5" strokeWidth={3} />
                            <span className="sr-only">{t.yes}</span>
                          </span>
                        ) : (
                          <span className="flex size-6 items-center justify-center rounded-full border border-ink/20 text-ink/50">
                            <X aria-hidden className="size-3" />
                            <span className="sr-only">{t.no}</span>
                          </span>
                        )
                      ) : (
                        <span className="leading-snug">{value[locale]}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
            <div aria-hidden className="border-t border-line" />
          </div>
        </Reveal>
      </Container>
    </Panel>
  );
}
