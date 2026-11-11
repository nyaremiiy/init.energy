import { Container } from "@/components/layout/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { products } from "@/content/products";
import { anchors, routes } from "@/content/routes";
import { segmentIcons } from "@/content/segments";
import { solutions } from "@/content/solutions";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import Image from "next/image";

const titleId = "ses-segments-title";

/** «СЕС для дому й для бізнесу»: two segment cards on photo backgrounds. */
export function SesSegments() {
  const locale = getLocale();
  const t = getMessages().ses;
  const cards = [
    { solution: solutions.find((item) => item.id === "house"), href: routes.services.house, niches: [] },
    // Industry pages under the business segment (SILO: hub → niche).
    {
      solution: solutions.find((item) => item.id === "business"),
      href: routes.services.business,
      niches: [{ label: t.segments.hotel, href: routes.solutions.hotel }],
    },
  ];

  return (
    <section
      id={anchors.sesSegments}
      aria-labelledby={titleId}
      className="scroll-mt-40 pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.segments.eyebrow}
            title={t.segments.title}
            titleId={titleId}
            lead={t.segments.lead}
          />
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {cards.map(({ solution, href, niches }, index) =>
            solution ? (
              <li key={solution.id}>
                <Reveal delay={index * 0.08} className="h-full">
                  <article className="relative isolate flex h-full min-h-120 flex-col justify-end overflow-hidden rounded-3xl text-white lg:min-h-150">
                    <div className="absolute inset-0 -z-10">
                      {/* TODO(content): segment photos (background) — placeholder until they arrive. */}
                      {solution.image ? (
                        <Image
                          src={solution.image.src}
                          alt={solution.image.alt[locale]}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className={`object-cover ${solution.id === "house" ? "object-top" : "object-center"}`}
                        />
                      ) : (
                        <MediaPlaceholder
                          tone="dark"
                          caption={t.segments.photoPending}
                          className="size-full rounded-none"
                        />
                      )}
                    </div>
                    <div
                      aria-hidden
                      className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/80 to-ink/35"
                    />

                    <div className="flex flex-col gap-6 p-card-sm lg:p-card">
                      <CardLabel tone="dark" icon={segmentIcons[solution.segmentIcon]}>
                        {solution.segment[locale]}
                      </CardLabel>
                      <div className="flex flex-col gap-3">
                        <Heading as="h3" size="h3" className="text-white">
                          {solution.title[locale]}
                        </Heading>
                        <p className="text-base leading-relaxed text-white/75">
                          {solution.description[locale]}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-sm text-white/75">{t.segments.checklist}</p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white">
                          {solution.products.map((item) => (
                            <li key={item.product}>{products[item.product].name}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Button
                          href={localizePath(href, locale)}
                          variant="primary"
                        >
                          {t.segments.cta}
                        </Button>
                        {niches.map((niche) => (
                          <ArrowLink key={niche.href} href={localizePath(niche.href, locale)} tone="dark">
                            {niche.label}
                          </ArrowLink>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ) : null,
          )}
        </ul>
      </Container>
    </section>
  );
}
