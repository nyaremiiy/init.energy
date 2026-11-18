import { Wrench, type LucideIcon } from "lucide-react";

import { Heading } from "./heading";
import { Reveal } from "./reveal";

type StepsListProps = {
  steps: { title: string; text: string }[];
  /** One icon per step, in order. */
  icons: LucideIcon[];
  /**
   * "wide": index · icon · title · description in one row from lg (sections).
   * "compact": the description stays under the title (narrow columns).
   */
  layout?: "wide" | "compact";
  /** Step titles are H3 under a section H2; "p" when a heading already sits above the list. Compact titles stay 20 px. */
  titleAs?: "h3" | "p";
};

/**
 * The one style for ordered steps on the site: rows divided by `line`, no
 * cards. Mobile: index and icon on one line, then the title and description;
 * md: index · icon · title, description under the title; lg (wide): four columns.
 * Grid templates: `--grid-template-columns-steps(-compact)` in globals.css.
 */
export function StepsList({ steps, icons, layout = "wide", titleAs = "h3" }: StepsListProps) {
  const wide = layout === "wide";

  return (
    <ol className="flex flex-col border-b border-line">
      {steps.map((step, index) => {
        const Icon = icons[index] ?? Wrench;
        const title = (
          <span className={`block font-heading text-h3-sm font-semibold text-ink ${wide ? "sm:text-h3" : ""}`}>{step.title}</span>
        );
        return (
          <li key={step.title} className="border-t border-line py-7">
            <Reveal delay={index * 0.06} distance={12}>
              <div
                className={`flex flex-col gap-4 md:grid md:grid-cols-steps-compact md:items-center md:gap-y-2 ${wide ? "md:gap-x-8" : "md:gap-x-5"} ${
                  wide ? "lg:grid-cols-steps lg:gap-8" : ""
                }`}
              >
                <div className="flex items-center gap-4 md:contents">
                  <span aria-hidden className="w-14 font-heading text-number-sm font-light text-ink tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-ink">
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                </div>
                {titleAs === "h3" ? (
                  <Heading as="h3" size="h3" weight="semibold">
                    {step.title}
                  </Heading>
                ) : (
                  <p>{title}</p>
                )}
                <p className={`text-body leading-relaxed text-muted md:col-start-3 ${wide ? "lg:col-start-auto" : ""}`}>{step.text}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
