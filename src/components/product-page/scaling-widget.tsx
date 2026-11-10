"use client";

import { useState } from "react";

import { PillRadio } from "@/components/ui/pill-radio";
import { useLocale } from "@/i18n/client";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

type ScalingWidgetProps = {
  name: string;
  moduleCapacityKwh: number;
  options: number[];
  defaultModules: number;
  labels: {
    legend: string;
    option: string;
    caption: string;
    approx: string;
    note: string;
    tilesLabel: string;
    unit: string;
  };
};

/** Pick 1–16 modules: total capacity and a grid of module tiles. SSR shows the default. */
export function ScalingWidget({
  name,
  moduleCapacityKwh,
  options,
  defaultModules,
  labels,
}: ScalingWidgetProps) {
  const locale = useLocale();
  const [modules, setModules] = useState(defaultModules);
  const max = Math.max(...options);
  const total = modules * moduleCapacityKwh;
  // The largest option is shown rounded (16 × 5,12 = 81,92 → «≈ 81»).
  const totalText =
    modules === max
      ? format(labels.approx, {
          value: formatNumber(Math.floor(total), locale),
        })
      : formatNumber(total, locale);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="flex flex-col gap-8 lg:col-span-5">
        <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
          <legend className="mb-3 text-sm font-medium text-white/75">
            {labels.legend}
          </legend>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <PillRadio
                key={option}
                tone="dark"
                name="scaling-modules"
                value={option}
                checked={modules === option}
                onChange={() => setModules(option)}
              >
                {format(labels.option, { count: String(option) })}
              </PillRadio>
            ))}
          </div>
        </fieldset>

        <p className="flex flex-col gap-2" aria-live="polite">
          <span className="font-heading text-hero-sm font-light text-white tabular-nums md:text-hero-md">
            {totalText}
          </span>
          <span className="text-sm text-white/75">
            {format(labels.caption, { count: String(modules), name })}
          </span>
        </p>

        <p className="text-sm text-white/75">
          {format(labels.note, {
            capacity: `${formatNumber(moduleCapacityKwh, locale)} ${labels.unit}`,
          })}
        </p>
      </div>

      <ul
        aria-label={format(labels.tilesLabel, {
          count: String(modules),
          max: String(max),
        })}
        className="grid grid-cols-4 gap-2 self-center sm:grid-cols-8 lg:col-span-7"
      >
        {Array.from({ length: max }, (_, index) => {
          const on = index < modules;

          return (
            <li
              key={index}
              aria-hidden
              className={`flex aspect-3/4 items-end justify-center rounded-xl pb-2 font-mono text-xs transition-colors duration-200 ease-tech motion-reduce:transition-none ${
                on
                  ? "bg-white text-ink"
                  : "border border-dashed border-white/25 text-white/40"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
