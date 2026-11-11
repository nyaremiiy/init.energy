import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Description } from "@/components/ui/description";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { routes } from "@/content/routes";
import { sesCalculatorProductCount } from "@/content/ses-calculator";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";

import { SesPaybackTabs } from "./ses-payback-tabs";

/**
 * Dark panel under the header: breadcrumbs, H1, lead, mode tabs and four
 * facts. The panel is extra tall at the bottom: the calculator below is
 * pulled up into it (see `SesPaybackPage`), as in the approved mock-up.
 */
export function SesPaybackHero() {
  const locale = getLocale();
  const t = getMessages().sesPayback;
  const facts = [
    { value: t.minuteValue, label: t.minutes },
    { value: String(sesCalculatorProductCount), label: t.models },
    { value: t.noRegistration, label: t.registration },
    { value: t.open, label: t.methodology },
  ];

  return (
    <Panel
      as="section"
      variant="dark"
      aria-labelledby="ses-calculator-title"
      className="pt-panel-sm sm:pt-panel"
      panelClassName="bg-ink-glow shadow-soft"
    >
      <Container
        inPanel
        className="flex flex-col gap-8 pt-28 pb-32 lg:gap-10 lg:pt-36 lg:pb-72"
      >
        <Breadcrumbs
          tone="dark"
          label={t.breadcrumbLabel}
          items={[
            { name: t.home, href: localizePath(routes.home, locale) },
            { name: t.calculators },
            { name: t.crumb },
          ]}
        />
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
            <Heading
              as="h1"
              id="ses-calculator-title"
              className="text-hero-sm text-white md:text-hero-md lg:text-hero"
            >
              {t.title}
            </Heading>
            <Description className="max-w-2xl">{t.lead}</Description>
            <SesPaybackTabs />
          </div>
          <dl aria-label={t.factsLabel} className="grid grid-cols-2 gap-3 lg:col-span-5">
            {facts.map((fact) => (
              <div key={fact.label} className="flex min-h-24 flex-col-reverse justify-between gap-2 rounded-2xl bg-white/8 p-4">
                <dt className="text-sm text-white/75">{fact.label}</dt>
                <dd className="font-heading text-stat-sm font-medium text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Panel>
  );
}
