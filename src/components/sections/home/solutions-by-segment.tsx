import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentCard } from "@/components/ui/segment-card";
import { routes } from "@/content/routes";
import { services } from "@/content/services";
import {
  getSolutionLinks,
  getSolutionProduct,
  solutions,
} from "@/content/solutions";
import { format, messages } from "@/lib/messages";

const titleId = "solutions-by-segment-title";

export function SolutionsBySegment() {
  const t = messages.solutionsBySegment;
  // TODO(content): add the backup power hub once that page exists.
  const hubs = [{ ...t.hubs.ses, href: services.turnkeySes.href }];

  return (
    <section
      aria-labelledby={titleId}
      className="-mt-12 bg-white pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          titleId={titleId}
          lead={t.lead}
          aside={
            <Link
              href={routes.calculator}
              className="group inline-flex items-center gap-2 font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {t.calculatorLink}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
            </Link>
          }
        />

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {solutions.map((solution) => (
              <SegmentCard
                key={solution.id}
                index={solution.index}
                segment={solution.segment}
                title={solution.title}
                description={solution.description}
                product={getSolutionProduct(solution)}
                productTerm={t.productTerm}
                specTerm={t.capacityTerm}
                links={getSolutionLinks(solution)}
                navLabel={format(t.cardNavLabel, { segment: solution.segment })}
                tone={solution.tone}
              />
            ))}
          </div>

          <ul
            className={`grid gap-4 ${hubs.length > 1 ? "md:grid-cols-2" : ""}`}
          >
            {hubs.map((hub) => (
              <li key={hub.href}>
                <Link
                  href={hub.href}
                  className="group flex h-full items-center justify-between gap-6 rounded-3xl bg-sky p-6 text-ink transition duration-300 motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:p-8"
                >
                  <span className="flex flex-col items-start gap-3">
                    <Label tone="onLight">{hub.label}</Label>
                    <span className="font-heading text-xl leading-tight font-medium tracking-tight sm:text-2xl">
                      {hub.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-6 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
