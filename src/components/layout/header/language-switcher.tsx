"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useMessages } from "@/i18n/client";
import { hasEnglish, localePrefix, type Locale } from "@/i18n/config";

import { languages } from "./header-data";

type LanguageSwitcherProps = {
  /** "text": «UA / EN» (header, menu). "pill": segmented control (footer). */
  variant?: "text" | "pill";
  className?: string;
};

/** Ukrainian path of the current page (strips the /en prefix). */
function basePath(pathname: string, locale: Locale): string {
  if (locale === "uk") return pathname;
  const stripped = pathname.slice(localePrefix[locale].length);
  return stripped === "" ? "/" : stripped;
}

const pillItem =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-heading text-caption font-medium tracking-eyebrow uppercase lg:h-9";

/**
 * Links to the same page in the other language (hreflang). If a page has no
 * English version yet, EN is shown muted and is not a link — no 404s and no
 * automatic redirects.
 */
export function LanguageSwitcher({ variant = "text", className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useMessages().footer;
  const path = basePath(usePathname() ?? "/", locale);
  const pill = variant === "pill";

  return (
    <div
      role="group"
      aria-label={t.languageLabel}
      className={
        pill
          ? `inline-flex items-center gap-1 rounded-full border border-line-dark p-1 ${className ?? ""}`
          : `inline-flex items-center gap-1 font-heading text-eyebrow font-medium tracking-eyebrow uppercase ${className ?? ""}`
      }
    >
      {languages.map((language, index) => {
        const isCurrent = language.code === locale;
        const href =
          language.code === "uk"
            ? path
            : hasEnglish(path)
              ? `${localePrefix[language.code]}${path}`
              : null;

        if (pill) {
          return isCurrent || !href ? (
            <span
              key={language.code}
              lang={language.code}
              aria-current={isCurrent ? "true" : undefined}
              aria-disabled={!isCurrent && !href ? true : undefined}
              className={`${pillItem} ${isCurrent ? "bg-white text-ink" : "text-faint-dark"}`}
            >
              {language.label}
            </span>
          ) : (
            <Link
              key={language.code}
              href={href}
              hrefLang={language.code}
              lang={language.code}
              className={`${pillItem} text-faint-dark transition-colors duration-200 ease-tech hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            >
              {language.label}
            </Link>
          );
        }

        return (
          <span key={language.code} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden className="text-faint-dark">
                /
              </span>
            ) : null}
            {isCurrent || !href ? (
              <span
                lang={language.code}
                aria-current={isCurrent ? "true" : undefined}
                aria-disabled={!isCurrent && !href ? true : undefined}
                className={isCurrent ? "text-white" : "text-faint-dark"}
              >
                {language.label}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={language.code}
                lang={language.code}
                className="rounded-sm text-faint-dark transition-colors duration-200 ease-tech hover:text-muted-dark focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
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
