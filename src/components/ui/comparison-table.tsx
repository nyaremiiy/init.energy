import { Check, Minus, X, type LucideIcon } from "lucide-react";

export type ComparisonStatus = "good" | "limited" | "bad";

export type ComparisonColumn = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Recommended option: dark glow header, white cells. */
  highlight?: boolean;
};

export type ComparisonRow = {
  id: string;
  label: string;
  icon: LucideIcon;
  cells: Record<string, { status: ComparisonStatus; text: string }>;
};

type ComparisonTableProps = {
  caption: string;
  /** Hidden header of the row-label column. */
  featureLabel: string;
  recommendedLabel: string;
  legendLabel: string;
  statusLabels: Record<ComparisonStatus, string>;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
};

/** Status mark: ink circle + check (advantage), outline + minus (limited), outline + x (drawback). */
function StatusMark({ status, label }: { status: ComparisonStatus; label: string }) {
  const Icon = status === "good" ? Check : status === "limited" ? Minus : X;
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
        status === "good" ? "bg-ink text-white" : status === "limited" ? "border border-faint text-ink" : "border border-line text-faint"
      }`}
    >
      <Icon aria-hidden size={12} strokeWidth={status === "good" ? 3 : 2} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Options compared feature by feature (e.g. generator / UPS / inverter + battery).
 * No horizontal scroll: on mobile each row is the feature above its cells; from
 * md a regular table. Explicit ARIA roles keep table semantics on the CSS grid.
 * Built for three options.
 */
export function ComparisonTable({ caption, featureLabel, recommendedLabel, legendLabel, statusLabels, columns, rows }: ComparisonTableProps) {
  const gridCols = "grid-cols-3 md:grid-cols-4";
  const pad = (index: number) => (index === 0 ? "pr-3 sm:pr-5 md:pl-5" : "px-3 sm:px-5");

  return (
    <div className="flex flex-col gap-6">
      <div role="table" aria-label={caption} className="text-small">
        <div role="row" className={`grid items-end ${gridCols}`}>
          <span role="columnheader" className="hidden md:block">
            <span className="sr-only">{featureLabel}</span>
          </span>
          {columns.map((column, index) => {
            const Icon = column.icon;
            return (
              <span
                key={column.id}
                role="columnheader"
                className={`flex flex-col gap-3 font-heading text-body font-semibold ${pad(index)} ${
                  column.highlight ? "rounded-t-tile bg-ink-glow py-5 text-white" : "py-4 text-ink"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    aria-hidden
                    className={`flex size-9 items-center justify-center rounded-full ${column.highlight ? "bg-white text-ink" : "border border-line bg-white text-ink"}`}
                  >
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  {column.highlight ? (
                    <span className="hidden rounded-full border border-line-dark px-2.5 py-0.5 font-sans text-caption font-medium text-muted-dark lg:inline">
                      {recommendedLabel}
                    </span>
                  ) : null}
                </span>
                <span>{column.label}</span>
                {column.highlight ? <span className="sr-only">({recommendedLabel})</span> : null}
              </span>
            );
          })}
        </div>

        {rows.map((row, rowIndex) => {
          const RowIcon = row.icon;
          const last = rowIndex === rows.length - 1;
          return (
            <div key={row.id} role="row" className={`grid border-t border-line ${gridCols}`}>
              <span role="rowheader" className="col-span-3 flex items-center gap-2 pt-4 font-medium text-ink md:col-span-1 md:py-5 md:pr-4">
                <RowIcon aria-hidden size={16} strokeWidth={1.7} className="shrink-0 text-muted" />
                {row.label}
              </span>
              {columns.map((column, index) => {
                const cell = row.cells[column.id];
                return (
                  <span
                    key={column.id}
                    role="cell"
                    className={`flex items-start gap-2 py-4 md:items-center md:py-5 ${pad(index)} ${
                      column.highlight ? `bg-white font-medium text-ink ${last ? "rounded-b-tile" : ""}` : cell.status === "bad" ? "text-muted" : "text-ink"
                    }`}
                  >
                    <StatusMark status={cell.status} label={statusLabels[cell.status]} />
                    <span className="leading-snug">{cell.text}</span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      <ul aria-label={legendLabel} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-muted">
        {(["good", "limited", "bad"] as const).map((status) => (
          <li key={status} className="flex items-center gap-2">
            <span aria-hidden>
              <StatusMark status={status} label="" />
            </span>
            {statusLabels[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
