"use client";

import { Cookie, Lock, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/content/routes";
import { useLocale, useMessages } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { useConsent } from "@/lib/consent/ConsentProvider";

const iconProps = { "aria-hidden": true, className: "size-5", strokeWidth: 1.7 } as const;
const textLink =
  "cursor-pointer rounded-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 transition-colors duration-150 ease-tech hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
/** «Відхилити» and «Прийняти всі» have the same size and weight (GDPR). */
const decisionButton = "min-h-11 whitespace-nowrap px-3 sm:px-4";

/** Delay after hydration, on an idle frame: the banner is never the LCP element. */
const showDelay = 800;

function CookieMark({ size }: { size: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-sky text-ink ${size === "md" ? "size-12" : "size-10"}`}
    >
      <Cookie className="size-5" strokeWidth={1.7} />
    </span>
  );
}

/** Real switch: role="switch", labelled by the row title, Space/Enter toggle natively. */
function Switch({ checked, disabled, labelledBy, describedBy, onChange }: {
  checked: boolean;
  disabled?: boolean;
  labelledBy: string;
  describedBy: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-tech focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-60 ${checked ? "bg-ink" : "bg-ink/15"}`}
    >
      <span
        aria-hidden
        className={`size-5.5 rounded-full bg-white transition-transform duration-200 ease-tech ${checked ? "translate-x-5.75" : "translate-x-0.75"}`}
      />
    </button>
  );
}

/** Settings: centred dialog on desktop, bottom sheet on phones; focus trapped, Esc / backdrop close. */
function CookieSettings() {
  const locale = useLocale();
  const t = useMessages().cookies;
  const { consent, accept, reject, save, closeSettings } = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function onKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeSettings();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? [])];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const rows = [
    { key: "necessary", checked: true, disabled: true, onChange: undefined },
    { key: "analytics", checked: analytics, disabled: false, onChange: setAnalytics },
    { key: "marketing", checked: marketing, disabled: false, onChange: setMarketing },
  ] as const;

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center md:p-6" onKeyDown={onKeyDown}>
      <div aria-hidden className="absolute inset-0 bg-ink/35 motion-safe:animate-enter" onClick={closeSettings} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-subtitle`}
        style={{ maxHeight: "85dvh" }}
        className="relative flex w-full flex-col overflow-hidden rounded-t-3xl bg-white motion-safe:animate-enter md:max-w-176 md:rounded-3xl md:bg-glass md:shadow-glass"
      >
        <div className="flex flex-col gap-1 overflow-y-auto px-card-sm pt-3 pb-card-sm md:p-8">
          <span aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 md:hidden" />
          <div className="flex items-start gap-4">
            <span className="hidden md:block"><CookieMark size="md" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 id={`${id}-title`} className="font-heading text-h3-sm font-medium text-ink">{t.settings.title}</h2>
              <p id={`${id}-subtitle`} className="text-sm text-ink/70">{t.settings.subtitle}</p>
            </div>
            <button
              type="button"
              data-autofocus
              onClick={closeSettings}
              aria-label={t.settings.close}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors duration-150 ease-tech hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X {...iconProps} />
            </button>
          </div>

          <ul className="mt-4 border-b border-line">
            {rows.map((row) => {
              const copy = t.categories[row.key];
              return (
                <li key={row.key} className="flex items-start gap-4 border-t border-line py-4 md:py-5">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span id={`${id}-${row.key}`} className="font-heading text-base font-semibold text-ink">{copy.title}</span>
                      {row.key === "necessary" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-ink/70">
                          <Lock aria-hidden className="size-3.5" strokeWidth={1.7} />
                          {t.settings.alwaysActive}
                        </span>
                      ) : null}
                    </p>
                    <p id={`${id}-${row.key}-text`} className="text-sm text-ink/70">{copy.text}</p>
                  </div>
                  <Switch
                    checked={row.checked}
                    disabled={row.disabled}
                    labelledBy={`${id}-${row.key}`}
                    describedBy={`${id}-${row.key}-text`}
                    onChange={row.onChange}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pb-safe">
        <div className="flex flex-col gap-3 border-t border-line px-card-sm pt-4 pb-card-sm md:flex-row md:items-center md:justify-between md:gap-4 md:border-0 md:px-8 md:pt-0 md:pb-8">
          <Link href={localizePath(routes.cookies, locale)} className={`hidden shrink-0 whitespace-nowrap text-sm md:inline ${textLink}`}>
            {t.policyLink}
          </Link>
          <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
            <Button type="button" variant="dark" onClick={accept} className={`col-span-2 md:order-3 ${decisionButton}`}>
              {t.settings.acceptAll}
            </Button>
            <Button type="button" variant="outline-light" onClick={reject} className={`md:order-1 ${decisionButton}`}>
              {t.settings.rejectAll}
            </Button>
            <Button type="button" variant="outline-light" onClick={() => save({ analytics, marketing })} className={`md:order-2 ${decisionButton}`}>
              {t.settings.save}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cookie banner (first visit or expired / new-version consent) and the
 * settings dialog. Rendered only on the client, ~0.8 s after hydration on
 * an idle frame, fixed at the bottom: no CLS, never the LCP element.
 * The page stays usable: no overlay behind the banner.
 */
export function CookieBanner() {
  const locale = useLocale();
  const t = useMessages().cookies;
  const { consent, ready, settingsOpen, accept, reject, openSettings } = useConsent();
  const [delayed, setDelayed] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!ready || consent) return;
    let idle = 0;
    const timer = window.setTimeout(() => {
      const show = () => setDelayed(true);
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(show, { timeout: 1000 });
      else show();
    }, showDelay);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [ready, consent]);

  const showBanner = ready && !consent && delayed && !settingsOpen;
  const policyHref = localizePath(routes.cookies, locale);

  return (
    <>
      {showBanner ? (
        // Width: min(1080px, 100% − 48px) from the side padding + max-w-270; pb-safe keeps it above the iPhone home bar.
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-safe">
          <div className="px-3 pb-3 md:px-6 md:pb-6">
          <section
            role="region"
            aria-label={t.regionLabel}
            className="pointer-events-auto mx-auto max-w-270 rounded-3xl bg-glass p-card-sm shadow-glass motion-safe:animate-enter md:px-6 md:py-5"
          >
            {/* One row from lg; phones and tablets stack the buttons under the text. */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex items-center gap-3 md:items-start md:gap-4 lg:min-w-0 lg:flex-1">
                <span className="md:hidden"><CookieMark size="sm" /></span>
                <span className="hidden md:block"><CookieMark size="md" /></span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 id={titleId} className="font-heading text-base font-medium text-ink">{t.banner.title}</h2>
                  <p className="hidden text-small text-ink/70 md:block">
                    {t.banner.text}{" "}
                    <Link href={policyHref} className={textLink}>{t.policyLink}</Link>
                  </p>
                </div>
              </div>
              <p className="text-sm text-ink/70 md:hidden">
                {t.banner.textShort}{" "}
                <Link href={policyHref} className={textLink}>{t.banner.more}</Link>
              </p>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-4 lg:shrink-0">
                {/* A grid on every width: both decisions always have the same width. */}
                <div className="grid grid-cols-2 gap-2 md:order-2 md:gap-3">
                  <Button type="button" variant="outline-light" onClick={reject} className={decisionButton}>
                    {t.banner.reject}
                  </Button>
                  <Button type="button" variant="dark" onClick={accept} className={decisionButton}>
                    {t.banner.acceptAll}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={(event) => openSettings(event.currentTarget)}
                  className={`self-center text-sm md:order-1 ${textLink}`}
                >
                  {t.banner.settings}
                </button>
              </div>
            </div>
          </section>
          </div>
        </div>
      ) : null}
      {settingsOpen ? <CookieSettings /> : null}
    </>
  );
}
