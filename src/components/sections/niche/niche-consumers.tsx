import { Container } from "@/components/layout/container";
import { CardLabel } from "@/components/ui/card-label";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { anchors } from "@/content/routes";
import type { SolutionPage } from "@/content/solutions";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

import { nicheIcons, nicheTones } from "./niche-ui";

const titleId = "niche-consumers-title";

/** «Where the energy goes»: six consumers on a surface panel, tag on top, text at the bottom. */
export function NicheConsumers({ page, locale }: { page: SolutionPage; locale: Locale }) {
  const t = getMessages().nichePage;

  return (
    <Panel
      as="section"
      variant="light"
      id={anchors.nicheConsumers}
      aria-labelledby={titleId}
      className="scroll-mt-28 pt-section-sm lg:pt-section"
    >
      <Container inPanel className="flex flex-col gap-section-head-sm py-panel-y-sm lg:gap-section-head lg:py-panel-y">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrows.consumers} title={page.consumers.title[locale]} titleId={titleId} lead={page.consumers.lead[locale]} />
        </Reveal>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.consumers.items.map((item, index) => {
            const tone = nicheTones[item.tone];
            return (
              <li key={item.name.en}>
                <Reveal delay={(index % 3) * 0.08} className="h-full">
                  <article className={`flex h-full min-h-56 flex-col justify-between gap-8 rounded-3xl p-card-sm lg:p-card ${tone.card}`}>
                    <h3>
                      <CardLabel tone={tone.dark ? "dark" : "light"} icon={nicheIcons[item.icon]}>
                        {item.name[locale]}
                      </CardLabel>
                    </h3>
                    <p className={`text-base leading-relaxed ${tone.dark ? "text-white" : "text-ink"}`}>{item.text[locale]}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Panel>
  );
}
