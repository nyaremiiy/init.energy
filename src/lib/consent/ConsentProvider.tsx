"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import {
  CONSENT_VERSION,
  consentModeSignals,
  deleteTrackingCookies,
  readConsent,
  writeConsent,
  type ConsentMethod,
  type ConsentState,
} from "./consent";
import { captureTracking, clearTrackingCookie } from "./tracking";

type Choice = { analytics: boolean; marketing: boolean };

type ConsentContextValue = {
  /** Saved decision; null before the visitor decides (or after expiry / new version). */
  consent: ConsentState | null;
  /** True after hydration: the banner and scripts may render. */
  ready: boolean;
  settingsOpen: boolean;
  accept: () => void;
  reject: () => void;
  save: (choice: Choice) => void;
  /** Opens the settings; focus returns to `trigger` when they close. */
  openSettings: (trigger?: HTMLElement | null) => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Consent Mode update + dataLayer event + window event for non-React scripts. */
function broadcast(state: ConsentState, method: ConsentMethod) {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];
  const signals = consentModeSignals(state);
  // gtag() is defined by the inline <head> script (consentHeadScript) on every page.
  w.gtag?.("consent", "update", signals);
  w.initConsent = { analytics: state.analytics, marketing: state.marketing };
  w.dataLayer.push({ event: "consent_update", analytics: state.analytics, marketing: state.marketing, method });
  window.dispatchEvent(new CustomEvent("consent:change", { detail: state }));
}

/**
 * Cookie consent for the whole site (mounted once in SiteChrome). Nothing
 * from analytics or ads loads before a decision: see ConsentScripts.
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // After hydration: the server never renders consent-dependent UI.
    const id = window.setTimeout(() => {
      const saved = readConsent();
      setConsent(saved);
      setReady(true);
      captureTracking(saved?.marketing === true);
    });
    return () => window.clearTimeout(id);
  }, []);

  const decide = useCallback((choice: Choice, method: ConsentMethod) => {
    const previous = readConsent();
    const state: ConsentState = { necessary: true, ...choice, version: CONSENT_VERSION, updatedAt: new Date().toISOString() };
    writeConsent(state);
    // Withdrawn categories: their cookies go now, their scripts stop on the next navigation.
    if (previous?.analytics && !state.analytics) deleteTrackingCookies("analytics");
    if (previous?.marketing && !state.marketing) {
      deleteTrackingCookies("marketing");
      clearTrackingCookie();
    }
    if (state.marketing) captureTracking(true);
    broadcast(state, method);
    setConsent(state);
    setSettingsOpen(false);
    const back = trigger.current;
    trigger.current = null;
    back?.focus();
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      ready,
      settingsOpen,
      accept: () => decide({ analytics: true, marketing: true }, "accept_all"),
      reject: () => decide({ analytics: false, marketing: false }, "reject_all"),
      save: (choice) => decide(choice, "custom"),
      openSettings: (element) => {
        trigger.current = element ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        setSettingsOpen(true);
      },
      closeSettings: () => {
        setSettingsOpen(false);
        const back = trigger.current;
        trigger.current = null;
        back?.focus();
      },
    }),
    [consent, ready, settingsOpen, decide],
  );

  return <ConsentContext value={value}>{children}</ConsentContext>;
}

export function useConsent(): ConsentContextValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside ConsentProvider");
  return value;
}
