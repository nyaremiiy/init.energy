import Image from "next/image";

import { Container } from "@/components/layout/container";
import { HeroCopy, type HeroAction } from "@/components/sections/hero/hero-copy";
import { HeroParallax } from "@/components/sections/hero/hero-parallax";
import { HeroPicture, type HeroImage } from "@/components/sections/hero/hero-picture";
import { HeroVideo } from "@/components/sections/hero/hero-video";
import { HeroSlider } from "@/components/sections/home/hero-slider";
import type { HeroSlide } from "@/components/sections/home/hero-slides";
import { JsonLd } from "@/components/seo/JsonLd";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Panel } from "@/components/ui/panel";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { getMessages } from "@/i18n/server";
import { absoluteUrl } from "@/lib/seo/metadata";

export type PageHeroMedia =
  | { type: "image"; src: string; alt: string }
  /** Pre-sized responsive set (AVIF 750–2560), as on the home hero. */
  | { type: "picture"; image: HeroImage; alt: string }
  | { type: "video"; src: string; poster: string }
  | { type: "placeholder"; label: string };

type PageHeroContent = {
  eyebrow: string;
  /** The page's only <h1>; "\n" starts a new line. */
  title: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  media: PageHeroMedia;
  /** Let long mobile copy define a taller hero instead of squeezing it into one viewport. */
  spaciousMobile?: boolean;
  /** Subtle breadcrumbs above the eyebrow + BreadcrumbList JSON-LD; the last item is the current page. */
  breadcrumbs?: { label: string; href?: string }[];
};

/** Single page content, or the rotating slides of the home and solar hub pages. */
export type PageHeroProps = PageHeroContent | { slides: HeroSlide[] };

const titleId = "hero-title";

function HeroMedia({ media }: { media: PageHeroMedia }) {
  if (media.type === "image") {
    // LCP image: preloaded, full width of the viewport.
    return <Image src={media.src} alt={media.alt} fill priority sizes="100vw" className="hero__image" />;
  }
  if (media.type === "picture") return <HeroPicture image={media.image} alt={media.alt} priority />;
  if (media.type === "video") return <HeroVideo src={media.src} poster={media.poster} />;
  return <MediaPlaceholder caption={media.label} tone="dark" fill align="end" className="rounded-none border-0" captionClassName="hidden md:mr-20 md:block" />;
}

/**
 * The site hero (home page style) for every page: rounded full-width dark
 * panel under the transparent header, media with the left-to-right gradient,
 * one H1, CTAs and the scroll indicator. Pages change only the media and the
 * text. `slides` keeps the rotating hero of the home and solar hub pages.
 */
export function PageHero(props: PageHeroProps) {
  const t = getMessages();
  const content = "slides" in props ? null : props;
  const actions: HeroAction[] = content
    ? [
        { ...content.primaryCta, variant: "primary" },
        ...(content.secondaryCta ? [{ ...content.secondaryCta, variant: "secondary" as const }] : []),
      ]
    : [];
  const crumbs = content?.breadcrumbs;
  const contentLayout = content?.spaciousMobile
    ? "relative z-10 flex min-h-svh items-center overflow-hidden py-32 md:absolute md:inset-0 md:min-h-0 md:pt-28 md:pb-24 lg:pt-32 lg:pb-0"
    : "absolute inset-0 z-10 flex items-center overflow-hidden pt-28 pb-24 lg:pt-32 lg:pb-0";

  return (
    <Panel
      as="section"
      variant="dark"
      aria-labelledby={content ? titleId : (props as { slides: HeroSlide[] }).slides[0]?.id}
      className="bg-white pt-panel-sm sm:pt-panel"
      panelClassName="hero shadow-soft"
    >
      {content ? (
        <>
          {crumbs ? (
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: crumbs.map((crumb, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: crumb.label,
                  ...(crumb.href ? { item: absoluteUrl(crumb.href) } : {}),
                })),
              }}
            />
          ) : null}
          <HeroParallax>
            <HeroMedia media={content.media} />
          </HeroParallax>
          <div className={contentLayout}>
            <Container inPanel>
              <HeroCopy
                id={titleId}
                eyebrow={content.eyebrow}
                lines={content.title.split("\n")}
                headingLevel="h1"
                description={content.lead}
                actions={actions}
                breadcrumbs={
                  crumbs
                    ? {
                        label: t.productPage.breadcrumbsLabel,
                        items: crumbs.map((crumb) => ({ name: crumb.label, href: crumb.href })),
                      }
                    : undefined
                }
              />
            </Container>
          </div>
        </>
      ) : (
        <HeroSlider slides={(props as { slides: HeroSlide[] }).slides} />
      )}
      {/* Darken the top so the transparent header stays readable. */}
      <div aria-hidden className="fade-from-ink pointer-events-none absolute inset-x-0 top-0 z-2 h-40 opacity-80 lg:h-56" />
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
        <ScrollIndicator />
      </div>
    </Panel>
  );
}
