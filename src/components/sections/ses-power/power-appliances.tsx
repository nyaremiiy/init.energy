"use client";

import { AirVent, CookingPot, Droplets, Flame, Laptop, Lightbulb, Refrigerator, Router, Tv, Zap, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { ResultSummary } from "@/components/calculator/result-summary";
import { chipClasses } from "@/components/ui/chip-styles";
import { CheckTile } from "@/components/ui/form/check-tile";
import { useLocale } from "@/i18n/client";
import { roundHours, runtimeHours } from "@/lib/calc/backup-runtime";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const icons: Record<string, LucideIcon> = {
  router: Router,
  lights: Lightbulb,
  laptop: Laptop,
  fridge: Refrigerator,
  boiler: Flame,
  tv: Tv,
  pump: Droplets,
  ac: AirVent,
  stove: CookingPot,
};

/** Display order of the tiles (the owner's mockup): light loads first, the heavy ones last. */
const order = ["router", "lights", "laptop", "fridge", "boiler", "tv", "pump", "ac", "stove"];

export type AppliancePickerProps = {
  appliances: { id: string; name: string; powerW: number }[];
  sets: { id: string; label: string; appliances: string[] }[];
  defaultSet: string;
  batteries: { kwh: number; capacityWh: number }[];
  usableShare: number;
  labels: {
    pickLead: string;
    setsLabel: string;
    appliancesLabel: string;
    total: string;
    battery: string;
    hours: string;
    none: string;
    summary: string;
    unitW: string;
  };
};

/**
 * «Оберіть, що має працювати без світла»: quick sets (the hub's basic / fridge /
 * house) and appliance tiles; the total power and the hours of a ≈ 5 and a
 * ≈ 16 kWh battery update as you pick — the same runtimeHours as the hub.
 */
export function PowerAppliances({ appliances, sets, defaultSet, batteries, usableShare, labels }: AppliancePickerProps) {
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);
  const [selected, setSelected] = useState<string[]>(sets.find((set) => set.id === defaultSet)?.appliances ?? []);
  const sorted = order.map((id) => appliances.find((item) => item.id === id)).filter((item) => item !== undefined);
  const power = appliances.filter((item) => selected.includes(item.id)).reduce((sum, item) => sum + item.powerW, 0);
  const hours = batteries.map((item) => (power > 0 ? roundHours(runtimeHours(item.capacityWh, power, usableShare)) : null));
  const sameSet = (ids: string[]) => ids.length === selected.length && ids.every((id) => selected.includes(id));

  return (
    <div className="flex flex-col gap-6 rounded-card border border-line-dark bg-fill-dark p-card-sm lg:p-card">
      <p className="text-body text-muted-dark">{labels.pickLead}</p>

      <div role="group" aria-label={labels.setsLabel} className="flex flex-wrap gap-2">
        {sets.map((set) => (
          <button
            key={set.id}
            type="button"
            aria-pressed={sameSet(set.appliances)}
            onClick={() => setSelected(set.appliances)}
            className={`cursor-pointer ${chipClasses({ selected: sameSet(set.appliances), tone: "dark" })}`}
          >
            {set.label}
          </button>
        ))}
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{labels.appliancesLabel}</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sorted.map((item) => (
            <CheckTile
              key={item.id}
              tone="dark"
              name="appliances"
              value={item.id}
              checked={selected.includes(item.id)}
              onChange={(checked) => setSelected((current) => (checked ? [...current, item.id] : current.filter((id) => id !== item.id)))}
              icon={icons[item.id] ?? Zap}
              label={item.name}
              meta={`${n(item.powerW)} ${labels.unitW}`}
            />
          ))}
        </div>
      </fieldset>

      <dl className="grid grid-cols-1 gap-2 border-t border-line-dark pt-6 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-small text-muted-dark">{labels.total}</dt>
          <dd className="font-heading text-stat-sm font-medium text-white tabular-nums sm:text-stat">
            {n(power)} {labels.unitW}
          </dd>
        </div>
        {batteries.map((item, index) => (
          <div key={item.kwh} className="flex flex-col gap-1">
            <dt className="text-small text-muted-dark">{format(labels.battery, { capacity: n(item.kwh) })}</dt>
            <dd className="font-heading text-stat-sm font-medium text-white tabular-nums sm:text-stat">
              {hours[index] === null ? <span className="text-small font-normal text-muted-dark">{labels.none}</span> : format(labels.hours, { hours: n(hours[index] ?? 0) })}
            </dd>
          </div>
        ))}
      </dl>

      <ResultSummary
        text={
          power > 0
            ? format(labels.summary, {
                power: n(power),
                small: n(batteries[0].kwh),
                big: n(batteries[1].kwh),
                smallHours: n(hours[0] ?? 0),
                bigHours: n(hours[1] ?? 0),
              })
            : labels.none
        }
      />
    </div>
  );
}
