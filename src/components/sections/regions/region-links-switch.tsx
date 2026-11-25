"use client";

import { useState, type ReactNode } from "react";

import { chipClasses } from "@/components/ui/chip-styles";

/**
 * Home page: one block with «Сонячні панелі | Резервне живлення». Both lists
 * are rendered on the server; the inactive one is `hidden`, so search engines
 * see all 52 links. This island only flips which one is shown.
 */
export function RegionLinksSwitch({
  label,
  tabs,
  panels,
}: {
  label: string;
  tabs: string[];
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`cursor-pointer ${chipClasses({ selected: active === index })}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div key={tabs[index]} hidden={active !== index}>
          {panel}
        </div>
      ))}
    </div>
  );
}
