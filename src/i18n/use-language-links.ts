"use client";

import { usePathname } from "next/navigation";

import { languages } from "@/components/layout/header/header-data";

import { useLocale } from "./client";
import { hasEnglish, localePrefix, type Locale } from "./config";

export type LanguageLink = {
  code: Locale;
  label: string;
  current: boolean;
  /** Same page in that language; null when the page has no version there yet. */
  href: string | null;
};

/** Ukrainian path of the current page (strips the locale prefix). */
function basePath(pathname: string, locale: Locale): string {
  if (locale === "uk") return pathname;
  const stripped = pathname.slice(localePrefix[locale].length);
  return stripped === "" ? "/" : stripped;
}

/** Path of the same page in `code`, or null if that version does not exist. */
function pathFor(code: Locale, path: string): string | null {
  if (code === "uk") return path;
  if (code === "en") return hasEnglish(path) ? `${localePrefix.en}${path}` : null;
  return null;
}

/**
 * Links to the current page in every site language, built from `languages`
 * (a new locale needs no component change). No automatic redirects.
 */
export function useLanguageLinks(): LanguageLink[] {
  const locale = useLocale();
  const path = basePath(usePathname() ?? "/", locale);

  return languages.map((language) => ({
    code: language.code,
    label: language.label,
    current: language.code === locale,
    href: pathFor(language.code, path),
  }));
}
