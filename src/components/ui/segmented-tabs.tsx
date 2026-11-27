"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

export type SegmentedTab<T extends string> = {
  id: T;
  label: string;
  icon?: ReactNode;
  /** id of the tabpanel this tab shows. */
  controls: string;
};

type SegmentedTabsProps<T extends string> = {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Stretch across the container (mobile menu); 12 px type so the labels never wrap. */
  fullWidth?: boolean;
  /** Prefix for the tab ids (the tabpanels point back with aria-labelledby). */
  idPrefix: string;
};

/**
 * Two-or-more-way switch on a `surface` pill: the active tab is ink with white
 * text. ARIA tabs with roving tabindex; ←/→ (and Home/End) move and select.
 */
export function SegmentedTabs<T extends string>({ tabs, value, onChange, label, fullWidth = false, idPrefix }: SegmentedTabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className={`gap-1 rounded-full bg-surface p-1 ${fullWidth ? "flex w-full" : "inline-flex"}`}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={`${idPrefix}-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={tab.controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              fullWidth ? "min-w-0 flex-1 px-2 text-eyebrow-sm" : "px-3 text-caption"
            } ${selected ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
