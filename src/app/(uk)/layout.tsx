import { SiteChrome } from "@/components/layout/site-chrome";
import { setRequestLocale } from "@/i18n/server";

/** Ukrainian pages at the domain root (no /uk/ prefix). */
export default function UkrainianLayout({ children }: LayoutProps<"/">) {
  setRequestLocale("uk");

  return <SiteChrome locale="uk">{children}</SiteChrome>;
}
