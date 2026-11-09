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
      className={`inline-flex items-center gap-1 font-heading text-eyebrow font-medium tracking-eyebrow uppercase ${className ?? ""}`}
    >
      {languages.map((language, index) => {
        const isSelected = language.code === selected;

        return (
          <span key={language.code} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden className="text-white/25">
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={language.code}
              aria-pressed={isSelected}
              onClick={() => setSelected(language.code)}
              className={`rounded-sm transition-colors duration-200 ease-tech focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? "text-white/90" : "text-white/40 hover:text-white/75"}`}
            >
              {language.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
