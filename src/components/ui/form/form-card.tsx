"use client";

import type { ComponentProps, ReactNode } from "react";

type FormCardTone = "surface" | "white" | "dark";

type FormCardProps = {
  tone?: FormCardTone;
  /** While sending: the whole form is disabled and marked busy. */
  busy?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<"form">, "children">;

const tones: Record<FormCardTone, string> = {
  surface: "bg-surface",
  white: "bg-white shadow-card",
  dark: "bg-ink text-white",
};

/** Form wrapper: card padding, background tone and busy state. Controls are disabled via fieldset. */
export function FormCard({ tone = "surface", busy = false, className, children, ...props }: FormCardProps) {
  return (
    <form aria-busy={busy || undefined} className={`rounded-card px-card-sm py-card-sm lg:p-card ${tones[tone]} ${className ?? ""}`} {...props}>
      <fieldset disabled={busy} className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
        {children}
      </fieldset>
    </form>
  );
}
