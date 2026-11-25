import type { LucideIcon } from "lucide-react";

import { ArrowLink } from "./arrow-link";
import { CardLabel } from "./card-label";

export type CompareRow = {
  id: string;
  name: string;
  href: string;
  linkLabel: string;
  type: string;
  install: string;
  /** Filter ids («apartment house») and the pills shown in «Для кого». */
  fits: { id: string; label: string; icon: LucideIcon }[];
  capacity: {
    value: string;
    /** Position on the line-up scale 0–1; `to` draws a range (modules, BESS blocks). */
    scale: { from: number; to?: number };
    note?: string;
  };
  power: { value: string; note?: string };
  cycles: string;
  house: { value: string; note?: string; muted?: boolean };
};

type ProductCompareTableProps = {
  id: string;
  caption: string;
  columns: { model: string; capacity: string; power: string; cycles: string; house: string; audience: string; link: string };
  moreLabel: string;
  rows: CompareRow[];
};

/** «865 Вт·год» → the figure in the body size, the unit smaller and muted. Text without a figure stays as is. */
function Amount({ text, muted = false }: { text: string; muted?: boolean }) {
  const match = /^(.*\d\+?)\s+(\D+)$/.exec(text);
  if (muted || !match) return <span className={muted ? "text-small text-muted" : "text-lead"}>{text}</span>;
  return (
    <span className="whitespace-nowrap tabular-nums">
      <span className="text-lead">{match[1]}</span> <span className="text-caption text-muted">{match[2]}</span>
    </span>
  );
}

/** Mini capacity scale: a dot, or a segment for a range. Decorative — the numbers are in the cell. */
function CapacityScale({ from, to }: { from: number; to?: number }) {
  const left = `${from * 100}%`;
  return (
    <span aria-hidden className="relative mt-2 block h-3 w-full">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      {to !== undefined ? (
        <span className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ left, width: `${(to - from) * 100}%` }} />
      ) : null}
      <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left }} />
      {to !== undefined ? (
        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${to * 100}%` }} />
      ) : null}
    </span>
  );
}

/** Visible only on mobile, where each row is a block; screen readers use the column headers. */
function MobileLabel({ children }: { children: string }) {
  return (
    <span aria-hidden className="shrink-0 text-small text-muted lg:hidden">
      {children}
    </span>
  );
}

/* Cells: a hover background with rounded ends on lg (a row has no radius of its own). */
const cell = "lg:table-cell lg:px-3 lg:py-5 lg:align-top lg:transition-colors lg:duration-150 lg:group-hover/row:bg-surface";
/* Mobile «label — value» lines. */
const line = "flex w-full items-baseline justify-between gap-4 border-t border-line py-3";

/**
 * Line-up comparison on the home page. From `lg` a regular table; on smaller
 * screens every row is a block (name and «for whom» on top, capacity with its
 * scale, then label — value lines), no horizontal scroll. Explicit ARIA roles
 * keep table semantics when `display` changes (Safari drops them otherwise).
 * Rows carry `data-fits`: the filter dims the others, nothing leaves the DOM.
 */
export function ProductCompareTable({ id, caption, columns, moreLabel, rows }: ProductCompareTableProps) {
  return (
    // `relative` keeps sr-only (absolutely positioned) children inside the box.
    <div id={id} className="compare-table relative">
      <table role="table" className="block w-full border-collapse text-left text-small text-ink lg:table">
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className="max-lg:sr-only">
          <tr role="row" className="border-b border-line font-heading text-eyebrow-sm tracking-eyebrow text-muted uppercase">
            {[columns.model, columns.capacity, columns.power, columns.cycles, columns.house, columns.audience].map((label) => (
              <th key={label} role="columnheader" scope="col" className="px-3 py-4 font-medium">
                {label}
              </th>
            ))}
            <th role="columnheader" scope="col" className="py-4">
              <span className="sr-only">{columns.link}</span>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="block lg:table-row-group">
          {rows.map((row) => (
            <tr
              key={row.id}
              role="row"
              data-fits={row.fits.map((fit) => fit.id).join(" ")}
              className="group/row flex flex-wrap items-start gap-x-4 border-b border-line py-6 transition-opacity duration-200 ease-tech motion-reduce:transition-none lg:table-row lg:py-0"
            >
              <th role="rowheader" scope="row" className={`order-1 min-w-0 flex-1 text-left font-normal lg:rounded-l-tile ${cell}`}>
                <span className="block font-heading text-body font-semibold">{row.name}</span>
                <span className="mt-1 block text-small text-muted">{row.type}</span>
                <span className="block text-caption text-muted">{row.install}</span>
              </th>

              <td role="cell" className={`order-3 mt-4 w-full lg:mt-0 lg:w-56 ${cell}`}>
                <span className="sr-only lg:hidden">{columns.capacity}: </span>
                <Amount text={row.capacity.value} />
                <CapacityScale from={row.capacity.scale.from} to={row.capacity.scale.to} />
                {row.capacity.note ? <span className="mt-1 block text-caption text-muted">{row.capacity.note}</span> : null}
              </td>

              <td role="cell" className={`order-4 mt-3 lg:mt-0 ${line} lg:w-auto lg:border-t-0 ${cell}`}>
                <MobileLabel>{columns.power}</MobileLabel>
                <span className="flex flex-col items-end lg:items-start">
                  <Amount text={row.power.value} />
                  {row.power.note ? <span className="text-caption text-muted">{row.power.note}</span> : null}
                </span>
              </td>

              <td role="cell" className={`order-5 ${line} lg:w-auto lg:border-t-0 ${cell}`}>
                <MobileLabel>{columns.cycles}</MobileLabel>
                <Amount text={row.cycles} />
              </td>

              <td role="cell" className={`order-6 ${line} lg:w-auto lg:border-t-0 ${cell}`}>
                <MobileLabel>{columns.house}</MobileLabel>
                <span className="flex flex-col items-end text-right lg:items-start lg:text-left">
                  <Amount text={row.house.value} muted={row.house.muted} />
                  {row.house.note ? <span className="text-caption text-muted">{row.house.note}</span> : null}
                </span>
              </td>

              <td role="cell" className={`order-2 ${cell}`}>
                <span className="sr-only">{columns.audience}: </span>
                <ul className="flex flex-col items-end gap-1.5 lg:items-start">
                  {row.fits.map((fit) => (
                    <li key={fit.id}>
                      <CardLabel icon={fit.icon}>{fit.label}</CardLabel>
                    </li>
                  ))}
                </ul>
              </td>

              {/* pr-1 leaves room for the arrow's hover shift. */}
              <td role="cell" className={`order-7 w-full pt-3 lg:w-auto lg:rounded-r-tile lg:pr-1 lg:text-right ${cell}`}>
                <ArrowLink href={row.href} aria-label={row.linkLabel}>
                  {moreLabel}
                </ArrowLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
