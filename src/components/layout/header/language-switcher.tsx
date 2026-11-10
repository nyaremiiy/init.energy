"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useMessages } from "@/i18n/client";
import { hasEnglish, localePrefix, type Locale } from "@/i18n/config";

import { languages } from "./header-data";

type LanguageSwitcherProps = {
  className?: string;
};

/** Ukrainian path of the current page (strips the /en prefix). */
function basePath(pathname: string, locale: Locale): string {
  if (locale === "uk") return pathname;
  const stripped = pathname.slice(localePrefix[locale].length);
  return stripped === "" ? "/" : stripped;
}

/**
 * "UA / EN": links to the same page in the other language (hreflang). If a
 * page has no English version yet, EN is shown muted and is not a link —
 * no 404s and no automatic redirects.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useMessages().footer;
  const path = basePath(usePathname() ?? "/", locale);

  return (
    <div
      role="group"
      aria-label={t.languageLabel}
      className={`inline-flex items-center gap-1 font-heading text-eyebrow font-medium tracking-eyebrow uppercase ${className ?? ""}`}
    >
      {languages.map((language, index) => {
        const isCurrent = language.code === locale;
        const href =
          language.code === "uk"
            ? path
            : hasEnglish(path)
              ? `${localePrefix[language.code]}${path}`
              : null;

        return (
          <span key={language.code} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden className="text-white/25">
                /
              </span>
            ) : null}
            {isCurrent || !href ? (
              <span
                lang={language.code}
                aria-current={isCurrent ? "true" : undefined}
                aria-disabled={!isCurrent && !href ? true : undefined}
                className={isCurrent ? "text-white/90" : "text-white/25"}
              >
                {language.label}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={language.code}
                lang={language.code}
                className="rounded-sm text-white/40 transition-colors duration-200 ease-tech hover:text-white/75 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {language.label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
