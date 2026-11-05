"use client";

import { ChevronDown } from "lucide-react";

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
      className={`flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className ?? ""}`}
    >
      <ChevronDown aria-hidden className="size-5" />
    </button>
  );
}
