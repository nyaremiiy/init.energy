"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

type Tip = { name: string; text: string; link: string; left: number; top: number };

/**
 * Hover / focus card over the region map (desktop only). The map links work
 * without JS; this island only reads `data-*` of the hovered or focused
 * region link, so the SVG itself is rendered once on the server. The card
 * repeats what the link's aria-label says, so it is hidden from assistive tech.
 */
export function RegionMapHover({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  function show(target: EventTarget | null) {
    const link = target instanceof Element ? target.closest<SVGAElement>("a[data-region]") : null;
    const container = box.current;
    if (!link || !container) return;
    const area = link.getBoundingClientRect();
    const frame = container.getBoundingClientRect();
    setTip({
      name: link.dataset.name ?? "",
      text: link.dataset.text ?? "",
      link: link.dataset.link ?? "",
      left: Math.min(Math.max(area.left + area.width / 2 - frame.left, 140), frame.width - 140),
      top: area.top - frame.top,
    });
  }

  return (
    <div
      ref={box}
      className="relative"
      onPointerOver={(event) => {
        if (event.pointerType === "mouse") show(event.target);
      }}
      onPointerLeave={() => setTip(null)}
      onFocus={(event) => show(event.target)}
      onBlur={() => setTip(null)}
    >
      {children}
      {tip ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 hidden w-72 -translate-x-1/2 -translate-y-full flex-col gap-2 rounded-tile bg-white p-4 text-ink shadow-card md:flex"
          style={{ left: tip.left, top: tip.top }}
        >
          <span className="font-heading text-body font-semibold">{tip.name}</span>
          <span className="text-small text-muted">{tip.text}</span>
          <span className="inline-flex items-center gap-1.5 text-small font-semibold">
            {tip.link}
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
