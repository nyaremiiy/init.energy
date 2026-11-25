"use client";

import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { anchors, sectionHref } from "@/content/routes";
import { useLocale, useMessages } from "@/i18n/client";

/**
 * Click handler for links to the lead form: scroll to the form on the current
 * page if there is one; otherwise the link's href (the home form) is followed.
 * Shared by the header CTA and the solutions menu.
 */
export function goToLeadForm(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const formSection = document.getElementById(anchors.contacts);
  if (!formSection) return;

  event.preventDefault();
  window.history.pushState(null, "", `#${anchors.contacts}`);
  formSection.scrollIntoView({ block: "start" });
}

/** Header CTA: prefer the form on the current page, fall back to the home form. */
export function HeaderLeadCta() {
  const locale = useLocale();
  const t = useMessages().chrome.header;

  return (
    <Button
      className="whitespace-nowrap"
      href={sectionHref(anchors.contacts, locale)}
      onClick={goToLeadForm}
      icon={<ArrowUpRight aria-hidden className="size-4" />}
    >
      {t.cta}
    </Button>
  );
}
