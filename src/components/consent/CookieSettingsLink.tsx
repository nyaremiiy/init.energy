"use client";

import { SlidersHorizontal } from "lucide-react";

import { useMessages } from "@/i18n/client";
import { useConsent } from "@/lib/consent/ConsentProvider";

/**
 * «Налаштування cookie»: reopens the settings with the saved choice.
 * `tone` follows the background: footer (dark) or a policy page (light).
 */
export function CookieSettingsLink({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const t = useMessages().cookies;
  const { openSettings } = useConsent();
  const colours =
    tone === "dark"
      ? "hover:text-white focus-visible:outline-white"
      : "text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink focus-visible:outline-ink";

  return (
    <button
      type="button"
      onClick={(event) => openSettings(event.currentTarget)}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-sm transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${colours} ${className}`}
    >
      <SlidersHorizontal aria-hidden className="size-5" strokeWidth={1.7} />
      {t.footerLink}
    </button>
  );
}
