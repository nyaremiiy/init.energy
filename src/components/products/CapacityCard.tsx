import Image from "next/image";

import { MediaPlaceholder } from "@/components/ui/media-placeholder";

export type CapacityCardProps = {
  chemistryLabel: string;
  /** Big number, already formatted for the locale («16,07»). */
  value: string;
  /** Muted unit next to the number («кВт·год»), with a qualifier if any. */
  unit: string;
  /** Muted word before the number («від»), for capacities given as a minimum. */
  prefix?: string;
  thumbnail?: { src: string; alt: string };
  /** Cells stated in content: drawn as a grid, 8 per row. */
  cellCount?: number;
  /** Cabinets of an industrial system: drawn as a row. */
  modules?: number;
  /** Position on the line-up scale, 0–1 (logarithmic, computed by the caller). */
  scalePosition: number;
  scaleMin: string;
  scaleMax: string;
};

const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Capacity at a glance: chemistry, the number, a battery drawing and where
 * the product sits in the line-up. The drawing and the scale are decorative
 * (aria-hidden) — every number on them is also plain text on the page.
 */
export function CapacityCard({
  chemistryLabel,
  value,
  unit,
  prefix,
  thumbnail,
  cellCount,
  modules,
  scalePosition,
  scaleMin,
  scaleMax,
}: CapacityCardProps) {
  const position = Math.min(1, Math.max(0, scalePosition));

  return (
    <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl bg-linear-to-br from-surface to-sky p-card-sm lg:p-card">
      <div aria-hidden className="glow-accent absolute inset-0 -z-10" />

      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-xs tracking-wide text-ink/70">
          {chemistryLabel}
        </p>
        {thumbnail ? (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-field bg-white">
            <Image
              src={thumbnail.src}
              alt={thumbnail.alt}
              fill
              unoptimized
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <MediaPlaceholder
            caption=""
            className="size-14 shrink-0 rounded-field"
          />
        )}
      </div>

      <p className="flex flex-wrap items-baseline gap-x-2 text-ink">
        {prefix ? (
          <span className="text-base text-ink/70">{prefix}</span>
        ) : null}
        <span className="font-heading text-number-sm font-light tabular-nums lg:text-number">
          {value}
        </span>
        <span className="text-base text-ink/70">{unit}</span>
      </p>

      <div aria-hidden className="rounded-2xl bg-white p-3">
        {cellCount ? (
          <ul className="grid grid-cols-8 gap-1">
            {Array.from({ length: cellCount }, (_, index) => (
              <li
                key={index}
                className="flex aspect-3/4 min-w-0 items-end justify-center rounded-md bg-linear-to-b from-accent to-accent-strong pb-1 font-mono text-xs text-white"
              >
                {pad(index)}
              </li>
            ))}
          </ul>
        ) : modules ? (
          <ul className="flex gap-2">
            {Array.from({ length: modules }, (_, index) => (
              <li
                key={index}
                className="flex aspect-3/4 flex-1 items-end justify-center rounded-md bg-linear-to-b from-accent to-accent-strong pb-1 font-mono text-xs text-white"
              >
                {pad(index)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-3 rounded-full bg-linear-to-r from-accent-strong to-accent" />
        )}
      </div>

      <div aria-hidden className="flex flex-col gap-2">
        <div className="relative h-1 rounded-full bg-line">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-ink"
            style={{ width: `${position * 100}%` }}
          />
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-white"
            style={{ left: `${position * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-ink/70 tabular-nums">
          <span>{scaleMin}</span>
          <span>{scaleMax}</span>
        </div>
      </div>
    </div>
  );
}
