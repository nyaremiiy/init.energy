import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { backupSegments, type SegmentCheck } from "@/content/backup";
import { products } from "@/content/products";
import { anchors } from "@/content/routes";
import { segmentIcons } from "@/content/segments";
import { localizePath, type Locale } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { formatQuantity } from "@/lib/format";

const titleId = "backup-segments-title";

/** Check row text: plain text, «SVIT HOME: 6,2 кВт · 5,12 кВт·год» from products.ts, or product names. */
function checkText(check: SegmentCheck, locale: Locale): string {
  if ("text" in check) return check.text[locale];
  if ("names" in check) return check.names.map((id) => products[id].name).join(", ");
  const product = products[check.brief];
  const output = product.specs.find((spec) => spec.key === "inverter" || spec.key === "power");
  const parts = [output && typeof output.value === "object" && "unit" in output.value ? formatQuantity(output.value, locale) : null, formatQuantity(product.capacity, locale)].filter(Boolean);
  return `${product.name}: ${parts.join(" · ")}`;
}

/**
 * «Для кого»: apartment, house and business on photo cards. Segment pages are planned.
 * Region pages pass their own title / lead and get the regional check rows («not only SVIT»).
 */
export function BackupSegments({ title, lead, regional = false }: { title?: string; lead?: string; regional?: boolean } = {}) {
  const locale = getLocale();
  const t = getMessages().backup.segments;

  return (
    <section id={anchors.backupSegments} aria-labelledby={titleId} className="relative scroll-mt-40 overflow-hidden pt-section-sm lg:pt-section">
      <SectionWatermark text="BACKUP" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={title ?? t.title} titleId={titleId} lead={lead ?? t.lead} />
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {backupSegments.map((segment, index) => (
            <li key={segment.id}>
              <Reveal delay={index * 0.08} className="h-full">
                <article className="relative isolate flex h-full min-h-120 flex-col justify-end overflow-hidden rounded-card text-white lg:min-h-140">
                  <Image
                    src={segment.image.src}
                    alt={segment.image.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="-z-10 object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 -z-10 scrim-segment" />

                  <div className="flex flex-col gap-5 p-card-sm lg:p-card">
                    <CardLabel tone="dark" icon={segmentIcons[segment.icon]}>
                      {segment.label[locale]}
                    </CardLabel>
                    <div className="flex flex-col gap-2">
                      <Heading as="h3" size="h3" className="text-white">
                        {segment.title[locale]}
                      </Heading>
                      <p className="text-body leading-relaxed text-muted-dark">{segment.text[locale]}</p>
                    </div>
                    <ul className="flex flex-col gap-2 text-small text-white">
                      {(regional ? segment.regionChecks : segment.checks).map((check, checkIndex) => (
                        <li key={checkIndex} className="flex items-start gap-2.5">
                          <Check aria-hidden size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
                          {checkText(check, locale)}
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={localizePath(segment.href, locale)}
                      variant="primary"
                      className="self-start"
                      icon={<ArrowUpRight aria-hidden className="size-4.5" />}
                      aria-label={`${t.cta}: ${segment.title[locale]}`}
                    >
                      {t.cta}
                    </Button>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
