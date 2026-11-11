import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { products } from "@/content/products";
import { routes } from "@/content/routes";
import { sesCalculatorConfig, typicalPlans } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { calculateSes } from "@/lib/calc/ses";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "ses-plans-title";

const toneClasses = {
  sky: { card: "bg-sky text-ink", muted: "text-ink/70", line: "border-ink/15" },
  surface: { card: "bg-surface text-ink", muted: "text-ink/70", line: "border-ink/15" },
  navy: { card: "bg-navy text-white", muted: "text-white/75", line: "border-white/16" },
  ink: { card: "bg-ink text-white", muted: "text-white/75", line: "border-white/16" },
} as const;

/** «Typical solar plants by size»: four segments, capacity from the calculator itself. */
export function SesPaybackPlans() {
  const locale = getLocale();
  const t = getMessages().sesPayback;

  return (
    <section aria-labelledby={titleId} className="relative overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="PLANS" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.plansEyebrow}
            title={t.plansTitle}
            titleId={titleId}
            lead={t.plansLead}
            aside={<ArrowLink href={routes.projects}>{t.plansAll}</ArrowLink>}
          />
        </Reveal>

        <div className="flex flex-col gap-6">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {typicalPlans.map((plan, index) => {
            const { kw } = calculateSes({
              objectType: plan.objectType,
              goal: "savings",
              monthlyKwh: plan.monthlyKwh,
              tariff: householdTariff.value,
              regionId: sesCalculatorConfig.defaults.regionId,
              placement: sesCalculatorConfig.defaults.placement,
              backupLoads: [],
              backupHours: sesCalculatorConfig.backupHours.default,
            });
            const product = products[plan.battery];
            const tone = toneClasses[plan.tone];

            return (
              <li key={plan.id}>
                <Reveal delay={index * 0.08} className="h-full">
                  <article className={`flex h-full min-h-72 flex-col gap-6 rounded-3xl p-card-sm lg:p-card ${tone.card}`}>
                    <div className="flex flex-col gap-1">
                      <Heading as="h3" size="h3">{t.plans[plan.id]}</Heading>
                      <p className={`text-sm ${tone.muted}`}>
                        {format(t.planUsage, { kwh: formatNumber(plan.monthlyKwh, locale) })}
                      </p>
                    </div>
                    <p className="mt-auto flex items-baseline gap-2">
                      <span className="font-heading text-number-sm font-light tabular-nums lg:text-number">
                        {formatNumber(kw, locale)}
                      </span>
                      <span className={`text-base ${tone.muted}`}>{t.kwUnit}</span>
                    </p>
                    <Link
                      href={localizePath(product.href, locale)}
                      className={`group flex items-center justify-between gap-3 border-t pt-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${tone.line}`}
                    >
                      <span>{plan.modules > 1 ? `${product.name} × ${plan.modules}` : product.name}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4.5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-ink/70">{t.plansNote}</p>
        </div>
      </Container>
    </section>
  );
}
