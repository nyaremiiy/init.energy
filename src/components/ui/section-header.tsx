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
  /**
   * "stacked" — eyebrow, H2 and lead on the left, aside on the right.
   * "split" — eyebrow and H2 on the left (7/12), lead and aside on the right (5/12).
   */
  layout?: "stacked" | "split";
};

/** The one header for every section: eyebrow + H2 + lead + optional link. */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  aside,
  tone = "light",
  layout = "stacked",
}: SectionHeaderProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-heading";
  const descriptionTone = tone === "dark" ? "onDark" : "onLight";
  const heading = (
    <Heading as="h2" id={titleId} size="h2" className={titleColor}>
      {title}
    </Heading>
  );

  if (layout === "split") {
    return (
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="flex flex-col items-start gap-5 lg:col-span-7">
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          {heading}
        </div>
        <div className="flex flex-col items-start gap-5 lg:col-span-5">
          {lead ? (
            <Description tone={descriptionTone}>{lead}</Description>
          ) : null}
          {aside}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex max-w-3xl flex-col items-start gap-5">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        {heading}
        {lead ? <Description tone={descriptionTone}>{lead}</Description> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
