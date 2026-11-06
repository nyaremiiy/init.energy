import { ArrowLink } from "./arrow-link";

type CompareRow = {
  id: string;
  name: string;
  href: string;
  type: string;
  capacity: string;
  audience: string;
  linkLabel: string;
};

type ProductCompareTableProps = {
  caption: string;
  columns: {
    model: string;
    type: string;
    capacity: string;
    audience: string;
    link: string;
  };
  moreLabel: string;
  rows: CompareRow[];
};

/** Visible only on mobile, where each row is stacked; screen readers use the column headers. */
function MobileLabel({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="shrink-0 whitespace-nowrap text-ink/70 md:hidden"
    >
      {children}
    </span>
  );
}

const cellClasses =
  "flex items-baseline justify-between gap-4 py-1 md:table-cell md:py-5 md:pr-6";

/**
 * Comparison table. From `md` it is a regular table; on mobile every row is a
 * stacked block (no horizontal scroll). Explicit ARIA roles keep table
 * semantics when `display` is changed (Safari drops them otherwise).
 */
export function ProductCompareTable({
  caption,
  columns,
  moreLabel,
  rows,
}: ProductCompareTableProps) {
  return (
    // `relative` keeps sr-only (absolutely positioned) children inside the box.
    <div className="relative">
      <table
        role="table"
        className="block w-full border-collapse text-left text-sm md:table"
      >
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className="max-md:sr-only">
          <tr
            role="row"
            className="border-b border-line font-heading text-eyebrow tracking-eyebrow text-ink/70 uppercase"
          >
            <th
              role="columnheader"
              scope="col"
              className="py-4 pr-6 font-medium"
            >
              {columns.model}
            </th>
            <th
              role="columnheader"
              scope="col"
              className="py-4 pr-6 font-medium"
            >
              {columns.type}
            </th>
            <th
              role="columnheader"
              scope="col"
              className="py-4 pr-6 font-medium"
            >
              {columns.capacity}
            </th>
            <th
              role="columnheader"
              scope="col"
              className="py-4 pr-6 font-medium"
            >
              {columns.audience}
            </th>
            <th role="columnheader" scope="col" className="py-4">
              <span className="sr-only">{columns.link}</span>
            </th>
          </tr>
        </thead>
        <tbody
          role="rowgroup"
          className="block divide-y divide-line border-t border-line text-ink md:table-row-group md:border-t-0"
        >
          {rows.map((row) => (
            <tr
              key={row.id}
              role="row"
              className="block py-5 md:table-row md:py-0"
            >
              <th
                role="rowheader"
                scope="row"
                className="block pb-2 text-base font-semibold whitespace-nowrap md:table-cell md:py-5 md:pr-6 md:text-sm"
              >
                {row.name}
              </th>
              <td role="cell" className={cellClasses}>
                <MobileLabel>{columns.type}</MobileLabel>
                <span className="text-right text-ink/70 md:text-left">
                  {row.type}
                </span>
              </td>
              <td role="cell" className={cellClasses}>
                <MobileLabel>{columns.capacity}</MobileLabel>
                <span className="font-medium whitespace-nowrap tabular-nums">
                  {row.capacity}
                </span>
              </td>
              <td role="cell" className={cellClasses}>
                <MobileLabel>{columns.audience}</MobileLabel>
                <span className="text-right text-ink/70 md:text-left">
                  {row.audience}
                </span>
              </td>
              {/* pr-1 leaves room for the arrow's hover shift. */}
              <td
                role="cell"
                className="block pt-3 md:table-cell md:py-5 md:pr-1 md:text-right"
              >
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
