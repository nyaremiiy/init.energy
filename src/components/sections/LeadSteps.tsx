import { Calculator, FileText, Phone, type LucideIcon } from "lucide-react";

type LeadStep = { title: string; description: string };

// Icons follow the order of `leadSection.steps` in messages/*.json.
const stepIcons: LucideIcon[] = [Phone, Calculator, FileText];

/**
 * Three consultation steps as a vertical timeline on the dark photo card:
 * 48 px circles (the first one filled white), a 1 px `line-dark` connector
 * between the circle centres.
 */
export function LeadSteps({ steps }: { steps: LeadStep[] }) {
  return (
    <ol className="flex w-full list-none flex-col gap-6 p-0">
      {steps.map((step, index) => {
        const Icon = stepIcons[index] ?? FileText;
        const first = index === 0;
        const last = index === steps.length - 1;

        return (
          <li key={step.title} className="relative flex gap-4">
            {last ? null : (
              <span aria-hidden className="absolute top-12 -bottom-6 left-6 w-px bg-line-dark" />
            )}
            <span
              aria-hidden
              className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ${
                first ? "bg-white text-ink" : "border border-line-dark text-white"
              }`}
            >
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <span className="flex flex-col gap-1 pt-1">
              <h3 className="font-heading text-body font-semibold text-white">{step.title}</h3>
              <span className="text-small text-muted-dark">{step.description}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
