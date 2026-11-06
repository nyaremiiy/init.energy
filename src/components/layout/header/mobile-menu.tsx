"use client";

import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { contactEmail, navItems, offices } from "./header-data";
import { LanguageSwitcher } from "./language-switcher";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
        onClick={() => setIsOpen((value) => !value)}
        className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
      >
        {isOpen ? (
          <X aria-hidden className="size-5" />
        ) : (
          <Menu aria-hidden className="size-5" />
        )}
      </button>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col gap-10 overflow-y-auto bg-slate-950 px-5 pt-28 pb-10 text-white sm:px-8"
        >
          <nav aria-label="Мобільне меню">
            <ul className="flex flex-col gap-5 text-2xl font-semibold">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={close}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6 text-sm text-white/80">
            {offices.map((office) => (
              <address key={office.id} className="flex flex-col gap-2 not-italic">
                <span className="inline-flex items-center gap-2">
                  <MapPin aria-hidden className="size-4 shrink-0" />
                  Офіс {office.city}, {office.address}
                </span>
                <a
                  href={office.phone.href}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone aria-hidden className="size-4 shrink-0" />
                  {office.phone.display}
                </a>
              </address>
            ))}
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <Mail aria-hidden className="size-4 shrink-0" />
              {contactEmail}
            </a>
          </div>

          <LanguageSwitcher className="mt-auto" />
        </div>
      ) : null}
    </div>
  );
}
