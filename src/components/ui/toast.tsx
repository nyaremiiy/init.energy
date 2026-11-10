"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastTone = "success" | "error";

type ToastMessage = { id: number; tone: ToastTone; text: string };

type ToastContextValue = {
  show: (tone: ToastTone, text: string) => void;
};

/** How long a notice stays on screen before it leaves. */
const DURATION_MS = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * One notice at a time, shown at the top-left of the viewport. Mount once
 * (in SiteChrome); any client component reads it through `useToast()`.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage>();
  const reduceMotion = useReducedMotion();

  const show = useCallback((tone: ToastTone, text: string) => {
    // A new object (new id) restarts the timer below even for the same text.
    setToast((previous) => ({ id: (previous?.id ?? 0) + 1, tone, text }));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(undefined), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ show }), [show]);
  const Icon = toast?.tone === "error" ? CircleAlert : CircleCheck;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-20 inset-x-4 z-50 sm:right-auto sm:w-96">
        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast.id}
              role={toast.tone === "error" ? "alert" : "status"}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -48 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 text-ink shadow-card"
            >
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-snug font-medium">{toast.text}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
