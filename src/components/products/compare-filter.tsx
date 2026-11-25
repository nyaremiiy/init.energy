"use client";

import { useState } from "react";

import { chipClasses } from "@/components/ui/chip-styles";

/**
 * «Усі / Квартира / Будинок / Бізнес» above the comparison table. It only sets
 * `data-filter` on the table; CSS (globals.css, `.compare-table`) dims the rows
 * whose `data-fits` don't match. Every row stays in the DOM and in the HTML.
 */
export function CompareFilter({
  tableId,
  label,
  options,
}: {
  tableId: string;
  label: string;
  options: { id: string; label: string }[];
}) {
  const [active, setActive] = useState("all");

  function pick(id: string) {
    setActive(id);
    const table = document.getElementById(tableId);
    if (!table) return;
    if (id === "all") delete table.dataset.filter;
    else table.dataset.filter = id;
  }

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={active === option.id}
          onClick={() => pick(option.id)}
          className={`cursor-pointer ${chipClasses({ selected: active === option.id })}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
