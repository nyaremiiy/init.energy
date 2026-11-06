import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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

export function ProductCompareTable({
  caption,
  columns,
  moreLabel,
  rows,
}: ProductCompareTableProps) {
  // `relative` keeps sr-only (absolutely positioned) children inside the scroll box.
  return (
    <div className="relative -mx-5 min-w-0 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-2xl border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line font-heading text-xs tracking-[0.12em] text-ink/70 uppercase">
            <th scope="col" className="py-4 pr-6 font-medium">
              {columns.model}
            </th>
            <th scope="col" className="py-4 pr-6 font-medium">
              {columns.type}
            </th>
            <th scope="col" className="py-4 pr-6 font-medium">
              {columns.capacity}
            </th>
            <th scope="col" className="py-4 pr-6 font-medium">
              {columns.audience}
            </th>
            <th scope="col" className="py-4">
              <span className="sr-only">{columns.link}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-ink">
          {rows.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="py-5 pr-6 font-semibold whitespace-nowrap"
              >
                {row.name}
              </th>
              <td className="py-5 pr-6 text-ink/70">{row.type}</td>
              <td className="py-5 pr-6 font-medium whitespace-nowrap tabular-nums">
                {row.capacity}
              </td>
              <td className="py-5 pr-6 text-ink/70">{row.audience}</td>
              {/* pr-1 leaves room for the arrow's hover shift inside the scroll box. */}
              <td className="py-5 pr-1 text-right">
                <Link
                  href={row.href}
                  aria-label={row.linkLabel}
                  className="group inline-flex items-center gap-1.5 font-semibold whitespace-nowrap underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  {moreLabel}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
