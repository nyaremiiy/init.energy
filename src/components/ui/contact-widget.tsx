"use client";

import { Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { companyContacts, offices } from "@/content/company";
import { useLocale, useMessages } from "@/i18n/client";
import { formatPhone } from "@/lib/format";

import { SocialLinks } from "./social-links";

/**
 * Round button at the bottom-right that opens a panel with the offices,
 * phones, email and social networks. Closes on the close button, Escape or
 * a click outside the panel.
 */
export function ContactWidget() {
  const locale = useLocale();
  const t = useMessages().chrome.contactWidget;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      data-floating
      className="fixed right-5 bottom-5 z-40 sm:right-8 sm:bottom-8"
    >
      {open ? (
        <div
          id="contact-widget-panel"
          role="dialog"
          aria-label={t.title}
          className="absolute right-0 bottom-16 w-72 rounded-card bg-ink p-card-sm text-white shadow-card motion-safe:animate-enter"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="font-heading text-body font-medium">{t.title}</p>
            <button
              type="button"
              aria-label={t.close}
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-dark transition-colors duration-150 ease-tech hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <ul className="mt-5 flex flex-col gap-5 text-small">
            {offices.map((office) => (
              <li key={office.id} className="flex flex-col gap-1">
                <a
                  href={office.mapHref}
                  target="_blank"
                  rel="noopener"
                  className="text-muted-dark underline underline-offset-4 decoration-line-dark hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {office.city[locale]}, {office.address[locale]}
                </a>
                {office.phone ? (
                  <a
                    href={office.phone.href}
                    className="font-medium text-white underline underline-offset-4 decoration-line-dark hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {formatPhone(office.phone.display)}
                  </a>
                ) : null}
              </li>
            ))}
            <li>
              <a
                href={companyContacts.email.href}
                className="font-medium text-white underline underline-offset-4 decoration-line-dark hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {companyContacts.email.display}
              </a>
            </li>
          </ul>

          <div className="mt-6 border-t border-line-dark pt-5">
            <SocialLinks variant="circle" iconClassName="size-4" />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={t.title}
        aria-expanded={open}
        aria-controls="contact-widget-panel"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-soft ring-1 ring-faint-dark transition-all duration-200 ease-tech hover:bg-navy hover:ring-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <Phone aria-hidden className="size-5" />
      </button>
    </div>
  );
}
