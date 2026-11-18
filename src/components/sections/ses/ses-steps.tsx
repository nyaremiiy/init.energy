import { Calculator, PencilRuler, ReceiptText, ShieldCheck, Wrench } from "lucide-react";

import { StepsSection } from "@/components/sections/steps-section";
import { anchors } from "@/content/routes";
import { buildSteps } from "@/content/ses";
import { getLocale, getMessages } from "@/i18n/server";

/** One icon per stage, in the order of `buildSteps`. */
const stepIcons = [Calculator, PencilRuler, ReceiptText, Wrench, ShieldCheck];

/** How we build a plant: five ordered stages. Durations are TODO(content). */
export function SesSteps() {
  const locale = getLocale();
  const t = getMessages().ses.steps;

  return (
    <StepsSection
      id={anchors.sesSteps}
      titleId="ses-steps-title"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      steps={buildSteps.map((step) => ({ title: step.title[locale], text: step.text[locale] }))}
      icons={stepIcons}
    />
  );
}
