"use client";

import { AlertCircle, Check } from "lucide-react";

import { InlineLink } from "@/components/ui/inline-link";

type FormStatusProps = {
  status: "success" | "failure";
  message: string;
  /** On failure: a phone to call instead (from content/company.ts). */
  phone?: { display: string; href: string };
};

/**
 * Inline result at the top of a form, next to the toast (it stays visible if
 * the toast is missed). Success: sky + Check. Failure: ink + AlertCircle + phone.
 * No red anywhere.
 */
export function FormStatus({ status, message, phone }: FormStatusProps) {
  const success = status === "success";
  const Icon = success ? Check : AlertCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-field px-4 py-3 text-small motion-safe:animate-enter ${success ? "bg-sky text-ink" : "bg-ink text-white"}`}
    >
      <Icon aria-hidden size={18} strokeWidth={1.7} className="mt-0.5 shrink-0" />
      <p>
        {message}
        {!success && phone ? (
          <>
            {" "}
            <InlineLink href={phone.href} tone="dark" className="whitespace-nowrap">
              {phone.display}
            </InlineLink>
          </>
        ) : null}
      </p>
    </div>
  );
}
