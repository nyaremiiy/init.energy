import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { anchors, routes } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

const titleId = "niche-sizing-title";

/**
 * «What size plant you need»: a semantic table (scrolls sideways inside its
 * box on narrow screens, as briefed) and the factors that change the output.
 */
export function NicheSizing({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const t = getMessages().nichePage;
  const columns = [t.table.type, t.table.rooms, t.table.kwhDay, t.table.kw, t.table.panels, t.table.roof];

  return (
    <section
      id={anchors.nicheSizing}
      aria-labelledby={titleId}
      className="relative scroll-mt-28 overflow-hidden pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="POWER" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrows.sizing}
            title={page.sizing.title[locale]}
            titleId={titleId}
            lead={page.sizing.lead[locale]}
            aside={<ArrowLink href={localizePath(routes.calculators.sesPayback, locale)}>{t.calcLink}</ArrowLink>}
          />
        </Reveal>
        <div className="flex flex-col gap-8">
          <Reveal>
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-labelledby={`${titleId}-caption`}>
              <table className="w-full min-w-200 border-collapse text-left text-sm sm:text-base">
                <caption id={`${titleId}-caption`} className="sr-only">{t.table.caption}</caption>
                <thead>
                  <tr className="border-b border-line">
                    {columns.map((column) => (
                      <th key={column} scope="col" className="py-3 pr-6 text-sm font-medium text-ink/70">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.sizing.rows.map((row) => (
                    <tr key={row.type.en} className="border-b border-line">
                      <th scope="row" className="py-4 pr-6 font-heading font-semibold text-ink">{row.type[locale]}</th>
                      <td className="py-4 pr-6 text-ink tabular-nums">{row.rooms[locale]}</td>
                      <td className="py-4 pr-6 text-ink tabular-nums">{row.kwhDay[locale]}</td>
                      <td className="py-4 pr-6 font-medium text-ink tabular-nums">{row.kw[locale]}</td>
                      <td className="py-4 pr-6 text-ink tabular-nums">{row.panels[locale]}</td>
                      <td className="py-4 text-ink tabular-nums">{row.roof[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-ink/70">{t.factorsTitle}</h3>
            <ul className="flex flex-wrap gap-2">
              {page.sizing.factors.map((factor) => (
                <li key={factor.en} className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium text-ink sm:h-11 sm:px-5">
                  {factor[locale]}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
