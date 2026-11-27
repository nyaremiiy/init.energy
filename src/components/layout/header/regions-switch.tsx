"use client";

import { BatteryCharging, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";

export type RegionsDirection = "solar" | "backup";

type RegionsSwitchProps = {
  labels: { switch: string; solar: string; backup: string };
  /** Server-rendered lists of links: both stay in the HTML, the inactive one is `hidden`. */
  lists: Record<RegionsDirection, ReactNode>;
  /** Optional per-direction footer (desktop panel: «Усі області на карті»). */
  footers?: Record<RegionsDirection, ReactNode>;
  /** Left of the switch (desktop panel: title and caption). */
  heading?: ReactNode;
  fullWidth?: boolean;
  /** Spacing around each list (the panel pads them, the mobile menu does not). */
  panelClassName?: string;
};

/** Backup pages (uk and en) open the backup list; every other page — solar. */
function directionFor(pathname: string): RegionsDirection {
  return /^(\/en)?\/rezervne-zhyvlennya\//.test(pathname) ? "backup" : "solar";
}

const directions: RegionsDirection[] = ["solar", "backup"];

/** Holds the direction of the «Регіони» menu; the lists and links come from the server. */
export function RegionsSwitch({ labels, lists, footers, heading, fullWidth = false, panelClassName }: RegionsSwitchProps) {
  const pathname = usePathname();
  const id = useId();
  const [state, setState] = useState(() => ({ pathname, direction: directionFor(pathname) }));
  // A new page resets the direction to that page's one (the header stays mounted between pages).
  const direction = state.pathname === pathname ? state.direction : directionFor(pathname);
  const select = (next: RegionsDirection) => setState({ pathname, direction: next });

  const tabs = directions.map((item) => ({
    id: item,
    label: labels[item],
    icon: item === "solar" ? <Sun aria-hidden className="size-3.5 shrink-0" /> : <BatteryCharging aria-hidden className="size-3.5 shrink-0" />,
    controls: `${id}-panel-${item}`,
  }));

  const switcher = (
    <SegmentedTabs tabs={tabs} value={direction} onChange={select} label={labels.switch} fullWidth={fullWidth} idPrefix={`${id}-tab`} />
  );

  return (
    <>
      {heading ? (
        <div className="flex items-start justify-between gap-6 px-6 pt-6 pb-3">
          {heading}
          {switcher}
        </div>
      ) : (
        switcher
      )}
      {directions.map((item) => (
        <div key={item} id={`${id}-panel-${item}`} role="tabpanel" aria-labelledby={`${id}-tab-${item}`} hidden={item !== direction} className={panelClassName}>
          {lists[item]}
        </div>
      ))}
      {footers
        ? directions.map((item) => (
            <div key={item} hidden={item !== direction}>
              {footers[item]}
            </div>
          ))
        : null}
    </>
  );
}
