"use client";

import { useState } from "react";

import { messages } from "@/lib/messages";

import { currentLanguage, languages } from "./header-data";

type LanguageSwitcherProps = {
  className?: string;
};

/**
 * Text language switch shown as "UA / EN"; the active language is brighter.
 * TODO(i18n): the site is not translated yet, so choosing a language only
 * changes the highlight. When /en/ exists, navigate to the same page in the
 * chosen language (Link with hrefLang) instead of local state.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [selected, setSelected] = useState<string>(currentLanguage);

  return (
    <div
      role="group"
      aria-label={messages.footer.languageLabel}
      className={`inline-flex items-center gap-2 text-sm font-semibold ${className ?? ""}`}
    >
      {languages.map((language, index) => {
        const isSelected = language.code === selected;

        return (
          <span key={language.code} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="text-white/40">
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={language.code}
              aria-pressed={isSelected}
              onClick={() => setSelected(language.code)}
              className={`rounded-sm transition-colors duration-200 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? "text-white" : "text-white/55 hover:text-white"}`}
            >
              {language.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
