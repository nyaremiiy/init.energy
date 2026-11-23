"use client";

import { Cookie, Lock } from "lucide-react";
import { InlineLink } from "@/components/ui/inline-link";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/form/switch";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/content/routes";
import { useLocale, useMessages } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { useConsent } from "@/lib/consent/ConsentProvider";

/** «Відхилити» and «Прийняти всі» have the same size and weight (GDPR). */
const decisionButton = "min-h-11 whitespace-nowrap px-3 sm:px-4";

/** Delay after hydration, on an idle frame: the banner is never the LCP element. */
const showDelay = 800;

function CookieMark({ size }: { size: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-tile bg-sky text-ink ${size === "md" ? "size-12" : "size-10"}`}
    >
      <Cookie className="size-5" strokeWidth={1.7} />
    </span>
  );
}

/** Real switch: role="switch", labelled by the row title, Space/Enter toggle natively. */
/** Settings: centred dialog on desktop, bottom sheet on phones; native modal <dialog>, Esc / backdrop close. */
function CookieSettings() {
  const locale = useLocale();
  const t = useMessages().cookies;
  const { consent, accept, reject, save, closeSettings } = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  /** Closes the native modal first: while it is open the page is inert and focus cannot return to the opener. */
  const finish = (action: () => void) => () => {
    dialogRef.current?.close();
    action();
  };

  // Native modal: the page behind becomes inert, focus stays inside, Esc fires
  // `cancel`. Scrolling is still locked on <body>: Safari ignores
  // overscroll-behavior on the backdrop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const rows = [
    { key: "necessary", checked: true, disabled: true, onChange: undefined },
    { key: "analytics", checked: analytics, disabled: false, onChange: setAnalytics },
    { key: "marketing", checked: marketing, disabled: false, onChange: setMarketing },
  ] as const;

  return (
    // The <dialog> is the full-screen layer (as the old fixed wrapper); the panel inside keeps its look.
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-subtitle`}
      onCancel={(event) => {
        event.preventDefault();
        finish(closeSettings)();
      }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none items-end justify-center overflow-hidden bg-transparent p-0 text-ink backdrop:bg-transparent open:flex md:p-6"
    >
      <div aria-hidden className="absolute inset-0 bg-faint motion-safe:animate-enter" onClick={finish(closeSettings)} />
      <div
        style={{ maxHeight: "85dvh" }}
        className="relative flex w-full flex-col overflow-hidden rounded-t-3xl bg-white motion-safe:animate-enter md:max-w-176 md:rounded-card md:bg-glass md:shadow-glass"
      >
        <div className="flex flex-col gap-1 overflow-y-auto px-card-sm pt-3 pb-card-sm md:p-8">
          <span aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-line md:hidden" />
          <div className="flex items-start gap-4">
            <span className="hidden md:block"><CookieMark size="md" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 id={`${id}-title`} className="font-heading text-h3-sm font-medium text-ink">{t.settings.title}</h2>
              <p id={`${id}-subtitle`} className="text-small text-muted">{t.settings.subtitle}</p>
            </div>
            <IconButton
              data-autofocus
              variant="outline-light"
              size="sm"
              icon="close"
              onClick={finish(closeSettings)}
              aria-label={t.settings.close}
            />
          </div>

          <ul className="mt-4 border-b border-line">
            {rows.map((row) => {
              const copy = t.categories[row.key];
              return (
                <li key={row.key} className="flex items-start gap-4 border-t border-line py-4 md:py-5">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span id={`${id}-${row.key}`} className="font-heading text-body font-semibold text-ink">{copy.title}</span>
                      {row.key === "necessary" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-caption text-muted">
                          <Lock aria-hidden className="size-3.5" strokeWidth={1.7} />
                          {t.settings.alwaysActive}
                        </span>
                      ) : null}
                    </p>
                    <p id={`${id}-${row.key}-text`} className="text-small text-muted">{copy.text}</p>
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
          <InlineLink href={localizePath(routes.cookies, locale)} className="hidden shrink-0 whitespace-nowrap text-small md:inline">
            {t.policyLink}
          </InlineLink>
          <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
            <Button type="button" variant="dark" onClick={finish(accept)} className={`col-span-2 md:order-3 ${decisionButton}`}>
              {t.settings.acceptAll}
            </Button>
            <Button type="button" variant="outline-light" onClick={finish(reject)} className={`md:order-1 ${decisionButton}`}>
              {t.settings.rejectAll}
            </Button>
            <Button type="button" variant="outline-light" onClick={finish(() => save({ analytics, marketing }))} className={`md:order-2 ${decisionButton}`}>
              {t.settings.save}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </dialog>
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
            className="pointer-events-auto mx-auto max-w-270 rounded-card bg-glass p-card-sm shadow-glass motion-safe:animate-enter md:px-6 md:py-5"
          >
            {/* One row from lg; phones and tablets stack the buttons under the text. */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex items-center gap-3 md:items-start md:gap-4 lg:min-w-0 lg:flex-1">
                <span className="md:hidden"><CookieMark size="sm" /></span>
                <span className="hidden md:block"><CookieMark size="md" /></span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 id={titleId} className="font-heading text-body font-medium text-ink">{t.banner.title}</h2>
                  <p className="hidden text-small text-muted md:block">
                    {t.banner.text}{" "}
                    <InlineLink href={policyHref}>{t.policyLink}</InlineLink>
                  </p>
                </div>
              </div>
              <p className="text-small text-muted md:hidden">
                {t.banner.textShort}{" "}
                <InlineLink href={policyHref}>{t.banner.more}</InlineLink>
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
                  className="cursor-pointer self-center rounded-sm text-small font-medium text-ink underline decoration-faint underline-offset-4 transition-colors duration-150 ease-tech hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:order-1"
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
