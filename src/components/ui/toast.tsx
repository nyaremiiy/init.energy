"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  tone: "success" | "error";
  onDismiss: () => void;
};

export function Toast({ message, tone, onDismiss }: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timeout);
  }, [onDismiss]);

  const Icon = tone === "success" ? CircleCheck : CircleAlert;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`fixed right-5 bottom-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed sm:right-8 sm:bottom-8 ${
        tone === "success"
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink"
      }`}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.7} />
      <span>{message}</span>
    </div>
  );
}
