import type { ReactNode } from "react";

import { Description } from "./description";
import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  lead?: string;
  /** Optional element on the right on large screens (usually an ArrowLink). */
  aside?: ReactNode;
  tone?: "light" | "dark";
};

/**
 * The one header for every section: eyebrow, H2 and lead on the left,
 * optional link on the right (below the lead on mobile).
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  aside,
  tone = "light",
}: SectionHeaderProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-heading";
  const descriptionTone = tone === "dark" ? "onDark" : "onLight";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex max-w-3xl flex-col items-start gap-5">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <Heading as="h2" id={titleId} size="h2" className={titleColor}>
          {title}
        </Heading>
        {lead ? <Description tone={descriptionTone}>{lead}</Description> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
