"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultLocale, type Locale } from "./config";
import { getMessagesFor, type Messages } from "./messages";

const LocaleContext = createContext<Locale>(defaultLocale);

/**
 * Locale for Client Components. Only the locale crosses the server/client
 * boundary; both dictionaries are bundled once and picked here.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useMessages(): Messages {
  return getMessagesFor(useLocale());
}
