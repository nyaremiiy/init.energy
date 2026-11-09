"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

import { chipClasses } from "@/components/ui/chip-styles";
import type { FaqTopic } from "@/content/faq";

type FaqItem = {
  id: string;
  topic: FaqTopic;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  topics: { id: FaqTopic; label: string }[];
  labels: { filter: string; all: string };
};

/**
 * Topic filter + accordion. Every answer is server-rendered; the filter and
 * closed items only hide rows, they never remove them from the DOM.
 */
export function FaqAccordion({ items, topics, labels }: FaqAccordionProps) {
  const baseId = useId();
  const [topic, setTopic] = useState<FaqTopic | "all">("all");
  // Several questions may be open; the first one is open by default.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(items[0] ? [items[0].id] : []),
  );

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filters: { id: FaqTopic | "all"; label: string }[] = [
    { id: "all", label: labels.all },
    ...topics,
  ];

  return (
    <div className="flex flex-col gap-8">
      {topics.length > 1 ? (
        <div
          role="group"
          aria-label={labels.filter}
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={topic === filter.id}
              onClick={() => setTopic(filter.id)}
              className={chipClasses({ selected: topic === filter.id })}
            >
              {filter.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="border-b border-line">
        {items.map((item, index) => {
          const isOpen = open.has(item.id);
          const buttonId = `${baseId}-q-${item.id}`;
          const panelId = `${baseId}-a-${item.id}`;
          const visible = topic === "all" || item.topic === topic;

          return (
            <li
              key={item.id}
              hidden={!visible}
              className="border-t border-line py-6"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="group flex w-full items-start gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:gap-6"
                >
                  <span className="mt-1 w-6 shrink-0 font-mono text-sm text-ink/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-h3-sm font-semibold text-ink">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-tech ${
                      isOpen
                        ? "border-ink bg-ink text-white"
                        : "border-ink/20 text-ink group-hover:border-ink"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="size-4.5" />
                    ) : (
                      <Plus className="size-4.5" />
                    )}
                  </span>
                </button>
              </h3>

              {/* Height animates via grid rows 0fr → 1fr; reduced motion turns it off. */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows] duration-250 ease-tech motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`max-w-180 pt-4 pl-10 text-base leading-relaxed text-ink/70 sm:pl-12 ${
                      isOpen ? "" : "invisible"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
