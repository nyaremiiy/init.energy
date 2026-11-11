import { Construction, Wrench } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { getMessagesFor } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";

/** Standalone screen rendered while public pages are temporarily unavailable. */
export function MaintenancePage({ locale }: { locale: Locale }) {
  const t = getMessagesFor(locale).maintenance;

  return (
    <main className="relative grid min-h-svh overflow-hidden bg-ink px-4.5 py-8 text-white sm:px-8 lg:px-10">
      <div aria-hidden className="absolute inset-0 bg-ink-glow" />
      <div className="relative mx-auto flex w-full max-w-360 flex-col justify-between gap-16">
        <Logo className="w-28 text-white sm:w-36" />

        <section className="grid max-w-2xl gap-8" aria-labelledby="maintenance-title">
          <div className="relative flex size-28 items-center justify-center rounded-panel-sm border border-white/15 bg-white/5 sm:size-36">
            <Construction className="size-12 text-white sm:size-16" strokeWidth={1.25} aria-hidden />
            <span className="absolute -right-3 -top-3 grid size-10 place-items-center rounded-full bg-white text-ink sm:size-12">
              <Wrench className="size-5 sm:size-6" strokeWidth={1.5} aria-hidden />
            </span>
          </div>

          <div className="grid gap-5">
            <p className="font-heading text-eyebrow-sm font-medium tracking-eyebrow text-white/70 sm:text-eyebrow">
              {t.eyebrow}
            </p>
            <h1 id="maintenance-title" className="max-w-xl font-heading text-hero-sm font-semibold tracking-tight sm:text-hero-md lg:text-hero">
              {t.title}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {t.lead}
            </p>
          </div>
        </section>

        <p className="text-small text-white/60">{t.note}</p>
      </div>
    </main>
  );
}
