import type { ReactNode } from "react";

import { Description } from "./description";
import { Heading } from "./heading";
import { Label } from "./label";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  lead?: string;
  /** Optional element aligned to the right on large screens (e.g. a link). */
  aside?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  aside,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex max-w-3xl flex-col items-start gap-5">
        <Label tone="onLight">{eyebrow}</Label>
        <Heading
          as="h2"
          id={titleId}
          className="text-3xl text-ink sm:text-4xl lg:text-5xl"
        >
          {title}
        </Heading>
        {lead ? <Description tone="onLight">{lead}</Description> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
