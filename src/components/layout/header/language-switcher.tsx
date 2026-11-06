"use client";

import { useState } from "react";

import { messages } from "@/lib/messages";

import { currentLanguage, languages } from "./header-data";

type LanguageSwitcherProps = {
  className?: string;
};

/**
 * Segmented UA/EN switch with a sliding white indicator (200 ms, ease-tech).
 * TODO(i18n): the site is not translated yet, so choosing a language only
 * moves the indicator. When /en/ exists, navigate to the same page in the
 * chosen language (Link with hrefLang) instead of local state.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [selected, setSelected] = useState<string>(currentLanguage);
  const selectedIndex = Math.max(
    0,
    languages.findIndex((language) => language.code === selected),
  );

  return (
    <div
      role="group"
      aria-label={messages.footer.languageLabel}
      className={`inline-flex rounded-full border border-white/22 p-0.5 ${className ?? ""}`}
    >
      <div className="relative grid grid-cols-2">
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 w-1/2 rounded-full bg-white transition-transform duration-200 ease-tech motion-reduce:transition-none ${selectedIndex === 1 ? "translate-x-full" : "translate-x-0"}`}
        />
        {languages.map((language) => {
          const isSelected = language.code === selected;

          return (
            <button
              key={language.code}
              type="button"
              lang={language.code}
              aria-pressed={isSelected}
              onClick={() => setSelected(language.code)}
              className={`relative z-10 inline-flex h-6 w-10 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? "text-ink" : "text-white/70 hover:text-white"}`}
            >
              {language.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
