"use client";

import type { ComponentProps } from "react";

import { trackEvent } from "@/lib/analytics";

type ContactLinkProps = ComponentProps<"a"> & {
  method: "phone" | "email";
  location: string;
};

/**
 * `tel:` / `mailto:` link that reports `contact_click` to the dataLayer.
 * `trackEvent` sends nothing without analytics consent.
 */
export function ContactLink({
  method,
  location,
  onClick,
  ...props
}: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent({ event: "contact_click", method, location });
        onClick?.(event);
      }}
    />
  );
}
