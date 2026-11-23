"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

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

const noSubscribe = () => () => {};
const supportsUntilFound = () => "onbeforematch" in HTMLElement.prototype;

/**
 * Topic filter + accordion. Every answer is server-rendered; the filter and
 * closed items only hide rows, they never remove them from the DOM.
 */
export function FaqAccordion({
  items,
  topics,
  labels,
  initialTopic,
}: FaqAccordionProps & { initialTopic?: FaqTopic }) {
  const baseId = useId();
  const [topic, setTopic] = useState<FaqTopic | "all">(initialTopic ?? "all");
  // Several questions may be open; the first one is open by default.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(items[0] ? [items[0].id] : []),
  );

  // Closed answers use hidden="until-found" where supported: Ctrl+F / text
  // fragments find them and open the item. React cannot render that value,
  // so it is set on the DOM; elsewhere they stay `invisible` as before.
  const untilFound = useSyncExternalStore(noSubscribe, supportsUntilFound, () => false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!supportsUntilFound()) return;
    const list = listRef.current;
    const onBeforeMatch = (event: Event) => {
      const id = (event.target as HTMLElement).closest<HTMLElement>("[data-faq-id]")?.dataset.faqId;
      if (!id) return;
      // Synchronous render: the row must open before the browser scrolls to the match.
      flushSync(() => setOpen((current) => new Set(current).add(id)));
    };
    list?.addEventListener("beforematch", onBeforeMatch);
    return () => list?.removeEventListener("beforematch", onBeforeMatch);
  }, []);

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

      <ul ref={listRef} className="border-b border-line">
        {items.map((item, index) => {
          const isOpen = open.has(item.id);
          const buttonId = `${baseId}-q-${item.id}`;
          const panelId = `${baseId}-a-${item.id}`;
          const visible = topic === "all" || item.topic === topic;

          return (
            <li
              key={item.id}
              data-faq-id={item.id}
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
                  <span className="mt-1 w-6 shrink-0 font-mono text-small text-faint">
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
                        : "border-line text-ink group-hover:border-ink"
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
                    ref={(node) => {
                      if (!node || !untilFound) return;
                      if (isOpen) node.removeAttribute("hidden");
                      else node.setAttribute("hidden", "until-found");
                    }}
                    className={`max-w-180 pt-4 pl-10 text-body leading-relaxed text-muted sm:pl-12 ${
                      isOpen || untilFound ? "" : "invisible"
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
