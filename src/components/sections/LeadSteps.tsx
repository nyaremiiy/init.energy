import { Calculator, FileText, Phone, type LucideIcon } from "lucide-react";

type LeadStep = { title: string; description: string };

// Icons follow the order of `leadSection.steps` in messages/*.json.
const stepIcons: LucideIcon[] = [Phone, Calculator, FileText];

/**
 * Three consultation steps as a timeline: vertical below `lg` (phones and the
 * narrow two-column tablet layout), a row of three from `lg`. A 1 px
 * connector joins the circle centres; each item draws the
 * segment to the next circle, so no width maths is needed.
 */
export function LeadSteps({ steps }: { steps: LeadStep[] }) {
  return (
    <ol className="grid w-full list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3 lg:gap-2">
      {steps.map((step, index) => {
        const Icon = stepIcons[index] ?? FileText;
        const first = index === 0;
        const last = index === steps.length - 1;

        return (
          <li
            key={step.title}
            className="relative flex gap-4 lg:flex-col lg:gap-5"
          >
            {last ? null : (
              <span
                aria-hidden
                className="absolute top-6 -bottom-12 left-6 w-px bg-line lg:bottom-auto lg:-right-8 lg:h-px lg:w-auto"
              />
            )}
            <span
              aria-hidden
              className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ${
                first
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink"
              }`}
            >
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <span className="flex flex-col gap-1.5 pt-3 lg:pt-0 lg:pr-4">
              <h3 className="font-sans text-base font-medium text-ink">
                {step.title}
              </h3>
              <span className="text-small text-ink/70">
                {step.description}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
