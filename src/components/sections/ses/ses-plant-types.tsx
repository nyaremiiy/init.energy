import { Container } from "@/components/layout/container";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors } from "@/content/routes";
import { plantRows, plantTypes } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

const titleId = "ses-types-title";

/**
 * Grid-tied, hybrid and off-grid plants compared side by side. The hybrid
 * column is highlighted as recommended. The table scrolls inside its own box.
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
          {/* TODO(content): link to the knowledge-base article «мережева чи гібридна СЕС» once it exists. */}
          <div className="overflow-x-auto rounded-3xl bg-white p-card-sm lg:p-card">
            <table className="w-full min-w-120 border-collapse text-left text-sm">
              <caption className="sr-only">{t.caption}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-4 pr-4 font-normal text-ink/70">
                    <span className="sr-only">{t.feature}</span>
                  </th>
                  {plantTypes.map((type) => (
                    <th
                      key={type.id}
                      scope="col"
                      className={`px-4 py-4 font-heading text-base font-semibold text-ink ${type.id === "hybrid" ? "rounded-t-2xl bg-ink text-white" : ""}`}
                    >
                      <span className="block">{type.label[locale]}</span>
                      {type.id === "hybrid" ? (
                        <span className="mt-1 block text-xs font-normal text-white/75">
                          {t.recommended}
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plantRows.map((row) => (
                  <tr key={row.label.en} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium text-ink">
                      {row.label[locale]}
                    </th>
                    {plantTypes.map((type) => (
                      <td
                        key={type.id}
                        className={`px-4 py-4 text-ink/80 ${type.id === "hybrid" ? "bg-ink/5 font-medium text-ink" : ""}`}
                      >
                        {row.values[type.id][locale]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </Panel>
  );
}
