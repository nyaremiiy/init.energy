"use client";

import { useSesPayback } from "@/components/calculator/ses-payback-state";
import { chipClasses } from "@/components/ui/chip-styles";
import { anchors } from "@/content/routes";
import { useMessages } from "@/i18n/client";

/**
 * Two modes of the same calculator: «solar and payback» (goal: both) and
 * «autonomy during outages» (goal: backup). Switching moves to the form.
 */
export function SesPaybackTabs() {
  const t = useMessages().sesPayback;
  const { state, update } = useSesPayback();
  const autonomy = state.goal === "backup";
  const tabs = [
    { id: "solar", label: t.tabs.solar, active: !autonomy, goal: "both" },
    { id: "autonomy", label: t.tabs.autonomy, active: autonomy, goal: "backup" },
  ] as const;

  return (
    <div role="group" aria-label={t.tabsLabel} className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={tab.active}
          onClick={() => {
            update({ goal: tab.goal });
            document.getElementById(anchors.calculator)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`cursor-pointer ${chipClasses({ selected: tab.active, tone: "dark" })}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
