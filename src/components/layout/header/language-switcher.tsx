"use client";

import Link from "next/link";
import { Fragment } from "react";

import { useMessages } from "@/i18n/client";
import { useLanguageLinks } from "@/i18n/use-language-links";

type LanguageSwitcherProps = {
  /** "dark" on dark panels (header, menu, footer); "light" on light headers. */
  tone?: "dark" | "light";
  className?: string;
};

const tones = {
  dark: {
    current: "text-white",
    other: "text-faint-dark hover:text-white focus-visible:outline-white",
    missing: "text-faint-dark",
    separator: "text-line-dark",
  },
  light: {
    current: "text-ink",
    other: "text-faint hover:text-ink focus-visible:outline-ink",
    missing: "text-faint",
    separator: "text-line",
  },
};

/**
 * «UA | EN» as text: the current language is plain text, the others link to
 * the same page in that language (hreflang). A language without a version of
 * this page is shown muted and is not a link — no 404s, no redirects.
 * Built from the locales list, so a new locale needs no change here.
 */
export function LanguageSwitcher({ tone = "dark", className }: LanguageSwitcherProps) {
  const t = useMessages().footer;
  const links = useLanguageLinks();
  const c = tones[tone];

  return (
    <nav
      aria-label={t.languageLabel}
      className={`inline-flex items-center gap-2.5 font-heading text-caption font-semibold tracking-widest uppercase ${className ?? ""}`}
    >
      {links.map((link, index) => (
        <Fragment key={link.code}>
          {index > 0 ? (
            <span aria-hidden className={c.separator}>
              |
            </span>
          ) : null}
          {link.current || !link.href ? (
            <span
              lang={link.code}
              aria-current={link.current ? "true" : undefined}
              aria-disabled={!link.current && !link.href ? true : undefined}
              className={`inline-flex min-h-11 items-center lg:min-h-0 ${link.current ? c.current : c.missing}`}
            >
              {link.label}
            </span>
          ) : (
            <Link
              href={link.href}
              hrefLang={link.code}
              lang={link.code}
              className={`inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 lg:min-h-0 ${c.other}`}
            >
              {link.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
