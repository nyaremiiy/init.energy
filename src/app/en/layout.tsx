import { SiteChrome } from "@/components/layout/site-chrome";
import { setRequestLocale } from "@/i18n/server";

/**
 * English pages under /en/. The root <html lang> stays "uk" (one root
 * layout keeps 404s and navigation simple); this wrapper marks the content
 * as English for screen readers and translation tools. Search engines read
 * the language from the content and hreflang.
 */
export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  setRequestLocale("en");

  return (
    <div lang="en" className="contents">
      <SiteChrome locale="en">{children}</SiteChrome>
    </div>
  );
}
