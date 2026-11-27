import { Check, Minus, X, type LucideIcon } from "lucide-react";

import { getMessages } from "@/i18n/server";

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
  /** No `status` — plain text without a mark (e.g. «Кому підходить»). */
  cells: Record<string, { status?: ComparisonStatus; text: string }>;
};

type ComparisonTableProps = {
  caption: string;
  /** Hidden header of the row-label column. */
  featureLabel: string;
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
 * The one component for comparing three options feature by feature (backup:
 * generator / UPS / inverter + battery; /cec/: grid-tied / hybrid / off-grid),
 * always in a light Panel. «Рекомендуємо», the legend and the status labels are
 * shared (`messages.compare`).
 * No horizontal scroll: on mobile each row is the feature above its cells (the
 * status mark above the text below 640 px); from
 * md a regular table. Explicit ARIA roles keep table semantics on the CSS grid.
 * Built for three options.
 */
export function ComparisonTable({ caption, featureLabel, columns, rows }: ComparisonTableProps) {
  const { recommended: recommendedLabel, legendLabel, status: statusLabels } = getMessages().compare;
  const gridCols = "grid-cols-3 md:grid-cols-4";
  // Phones: 8 px between the three columns, so a word like «обов'язково» fits a ~100 px cell.
  const pad = (index: number) => (index === 0 ? "pr-2 sm:pr-5 md:pl-5" : "px-2 sm:px-5");

  return (
    <div className="flex flex-col gap-6">
      <div role="table" aria-label={caption} className="text-small">
        <div role="row" className={`grid items-end ${gridCols}`}>
          {/* Phones: out of the grid (sr-only) but still a column header, or every cell would map to the wrong column. */}
          <span role="columnheader" className="sr-only md:not-sr-only">
            <span className="sr-only">{featureLabel}</span>
          </span>
          {columns.map((column, index) => {
            const Icon = column.icon;
            return (
              <span
                key={column.id}
                role="columnheader"
                // Phones: 12 px names, so «накопичувач» fits a ~90 px column at 360 px.
                className={`flex min-w-0 flex-col gap-3 font-heading text-eyebrow-sm font-semibold wrap-anywhere sm:text-body ${pad(index)} ${
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
          // A row without marks (e.g. «Кому підходить») has phrases, not yes/no: on phones each option takes
          // the full width under its own name — a third of 360 px is too narrow for «відключеннями».
          const textOnly = columns.every((column) => !row.cells[column.id].status);
          return (
            <div key={row.id} role="row" className={`grid border-t border-line ${gridCols}`}>
              <span role="rowheader" className="col-span-3 flex items-center gap-2 pt-4 font-medium text-ink md:col-span-1 md:py-5 md:pr-4">
                <RowIcon aria-hidden size={16} strokeWidth={1.7} className="shrink-0 text-muted" />
                {row.label}
              </span>
              {columns.map((column, index) => {
                const cell = row.cells[column.id];
                const layout = textOnly
                  ? `col-span-3 gap-0.5 md:col-span-1 md:flex-row md:px-5 ${column.highlight ? "px-2 sm:px-5" : ""} ${index === columns.length - 1 ? "pt-2 pb-4" : "py-2"}`
                  : `gap-1.5 py-4 sm:flex-row sm:gap-2 ${pad(index)}`;
                return (
                  <span
                    key={column.id}
                    role="cell"
                    // Phones: the mark above the text, so the text gets the whole (narrow) cell;
                    // 13 px text, so words like «автоматично» fit a ~90 px cell at 360 px.
                    className={`flex flex-col items-start text-caption sm:text-small md:items-center md:py-5 ${layout} ${
                      column.highlight ? `bg-white font-medium text-ink ${last ? "rounded-b-tile" : ""}` : cell.status === "bad" ? "text-muted" : "text-ink"
                    }`}
                  >
                    {textOnly ? (
                      <span aria-hidden className="font-normal text-muted md:hidden">
                        {column.label}
                      </span>
                    ) : null}
                    {cell.status ? <StatusMark status={cell.status} label={statusLabels[cell.status]} /> : null}
                    {/* wrap-anywhere: a last resort (320 px), a long word never runs into the next column. */}
                    <span className="min-w-0 leading-snug wrap-anywhere">{cell.text}</span>
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
