/**
 * Locales of the site. Ukrainian lives at the domain root (no /uk/ prefix),
 * English under /en/. Only pages listed in `localizedPaths` have an English
 * version; everything else stays Ukrainian-only.
 */
export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uk";

/** Text in every locale (content files). */
export type Localized = Record<Locale, string>;

export const htmlLang: Record<Locale, string> = { uk: "uk", en: "en" };
export const ogLocale: Record<Locale, string> = { uk: "uk_UA", en: "en_US" };

/** Prefix for a locale: "" for Ukrainian (root), "/en" for English. */
export const localePrefix: Record<Locale, string> = { uk: "", en: "/en" };

/** Paths (with trailing slash) that exist in English. */
export const localizedPaths = [
  "/",
  "/svit-600/",
  "/svit-plus-5000/",
  "/svit-home/",
  "/svit-plus-16000/",
  "/ses/",
  "/svit-plus-16000/",
  "/bess/",
] as const;

export function hasEnglish(path: string): boolean {
  return (localizedPaths as readonly string[]).includes(path);
}

/**
 * The URL of `path` in `locale`. Paths without an English version stay on
 * the Ukrainian URL, so links never lead to a 404.
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  const [pathname, hash] = path.split("#");
  if (!hasEnglish(pathname)) return path;
  const localized = `${localePrefix[locale]}${pathname}`;
  return hash === undefined ? localized : `${localized}#${hash}`;
}
