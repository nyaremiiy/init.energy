"use client";

import { Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { companyContacts, offices } from "@/content/company";
import { formatPhone } from "@/lib/format";

import { SocialLinks } from "./social-links";

/**
 * Round button at the bottom-right that opens a panel with the offices,
 * phones, email and social networks. Closes on the close button, Escape or
 * a click outside the panel.
 */
export function ContactWidget() {
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
      className="fixed right-5 bottom-5 z-40 sm:right-8 sm:bottom-8"
    >
      {open ? (
        <div
          id="contact-widget-panel"
          role="dialog"
          aria-label="Контакти"
          className="absolute right-0 bottom-16 w-72 rounded-3xl bg-ink p-card-sm text-white shadow-card motion-safe:animate-enter"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="font-heading text-base font-medium">
              Контакти
            </p>
            <button
              type="button"
              aria-label="Закрити контакти"
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-full text-white/75 transition-colors duration-150 ease-tech hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <ul className="mt-5 flex flex-col gap-5 text-sm">
            {offices.map((office) => (
              <li key={office.id} className="flex flex-col gap-1">
                <a
                  href={office.mapHref}
                  target="_blank"
                  rel="noopener"
                  className="text-white/75 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {office.city}, {office.address}
                </a>
                <a
                  href={office.phone.href}
                  className="font-medium text-white underline underline-offset-4 decoration-white/30 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {formatPhone(office.phone.display)}
                </a>
              </li>
            ))}
            <li>
              <a
                href={companyContacts.email.href}
                className="font-medium text-white underline underline-offset-4 decoration-white/30 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {companyContacts.email.display}
              </a>
            </li>
          </ul>

          <div className="mt-6 border-t border-white/16 pt-5">
            <SocialLinks variant="circle" iconClassName="size-4" />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Контакти"
        aria-expanded={open}
        aria-controls="contact-widget-panel"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-soft transition-colors duration-200 ease-tech hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <Phone aria-hidden className="size-5" />
      </button>
    </div>
  );
}
