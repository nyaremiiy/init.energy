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
  /** Position on the line-up scale, 0–1 (logarithmic, computed by the caller). */
  scalePosition: number;
  scaleMin: string;
  scaleMax: string;
};

/**
 * Capacity at a glance: chemistry, the number and where the product sits in
 * the line-up. The scale is decorative (aria-hidden) — every number on it is
 * also plain text on the page.
 */
export function CapacityCard({
  chemistryLabel,
  value,
  unit,
  prefix,
  thumbnail,
  scalePosition,
  scaleMin,
  scaleMax,
}: CapacityCardProps) {
  const position = Math.min(1, Math.max(0, scalePosition));
  const hasImage = Boolean(thumbnail);

  return (
    <div
      className={`group relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl p-card-sm transition-shadow duration-300 ease-tech hover:shadow-card focus-within:shadow-card lg:p-card ${
        hasImage
          ? "min-h-80 justify-between bg-ink lg:min-h-96"
          : "bg-linear-to-br from-surface to-sky"
      }`}
    >
      {thumbnail ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 ease-tech motion-safe:group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-ink/95 via-ink/75 to-ink/35"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-ink/35"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="glow-accent absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 ease-tech group-hover:opacity-100 group-focus-within:opacity-100"
        />
      )}

      <div className="relative z-10 flex min-h-20 items-start justify-between gap-4 lg:min-h-24">
        <p
          className={`font-mono text-xs tracking-wide transition-colors duration-300 ease-tech ${
            hasImage
              ? "text-white/75 group-hover:text-white"
              : "text-ink/70 group-hover:text-ink"
          }`}
        >
          {chemistryLabel}
        </p>
        {!thumbnail ? (
          <MediaPlaceholder
            caption=""
            className="size-20 shrink-0 rounded-2xl transition-transform duration-300 ease-tech motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-105 lg:size-24"
          />
        ) : null}
      </div>

      <p
        className={`relative z-10 flex flex-wrap items-baseline gap-x-2 ${
          hasImage ? "text-white" : "text-ink"
        }`}
      >
        {prefix ? (
          <span className={`text-base ${hasImage ? "text-white/75" : "text-ink/70"}`}>
            {prefix}
          </span>
        ) : null}
        <span className="font-heading text-number-sm font-light tabular-nums lg:text-number">
          {value}
        </span>
        <span className={`text-base ${hasImage ? "text-white/75" : "text-ink/70"}`}>
          {unit}
        </span>
      </p>

      <div aria-hidden className="relative z-10 flex flex-col gap-2">
        <div
          className={`relative h-1 rounded-full ${hasImage ? "bg-white/30" : "bg-line"}`}
        >
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-colors duration-300 ease-tech group-hover:bg-accent-strong ${
              hasImage ? "bg-white" : "bg-ink"
            }`}
            style={{ width: `${position * 100}%` }}
          />
          <div
            className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform duration-300 ease-tech motion-safe:group-hover:scale-125 ${
              hasImage ? "border-white bg-ink" : "border-ink bg-white"
            }`}
            style={{ left: `${position * 100}%` }}
          />
        </div>
        <div
          className={`flex justify-between text-xs tabular-nums ${
            hasImage ? "text-white/75" : "text-ink/70"
          }`}
        >
          <span>{scaleMin}</span>
          <span>{scaleMax}</span>
        </div>
      </div>
    </div>
  );
}
