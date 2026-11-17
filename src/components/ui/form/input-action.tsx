"use client";

import type { ComponentPropsWithoutRef } from "react";

import { IconButton } from "@/components/ui/icon-button";

import { TextInput, type TextInputProps } from "./controls";

type InputActionProps = TextInputProps & {
  /** Accessible name of the round action button. */
  actionLabel: string;
  loading?: boolean;
  /** Type of the action button (submit for forms). */
  actionType?: ComponentPropsWithoutRef<"button">["type"];
  disabled?: boolean;
};

/** Text input with a round action button inside (e.g. the newsletter). */
export function InputAction({ actionLabel, loading = false, actionType = "submit", disabled, ...props }: InputActionProps) {
  const dark = props.tone === "dark";
  return (
    <div className="relative">
      <TextInput {...props} disabled={disabled} className={`pr-16 ${props.className ?? ""}`} />
      <IconButton
        type={actionType}
        aria-label={actionLabel}
        disabled={disabled || loading}
        loading={loading}
        variant={dark ? "solid-light" : "solid-dark"}
        size="sm"
        className="absolute top-1.5 right-1.5"
      />
    </div>
  );
}
