"use client";

import { Mouse } from "lucide-react";

type ScrollIndicatorProps = {
  className?: string;
};

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  function scrollToNextSection() {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Прокрутити до наступної секції"
      onClick={scrollToNextSection}
      className={`group flex flex-col items-center gap-2 text-white/70 transition duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className ?? ""}`}
    >
      <Mouse
        aria-hidden
        className="size-5 transition-transform duration-200 group-hover:translate-y-1"
      />
      <span className="text-xs font-medium uppercase tracking-widest">
        Гортайте далі
      </span>
    </button>
  );
}
