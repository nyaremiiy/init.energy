import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { getLocale, getMessages } from "@/i18n/server";

import { RegionPills } from "./regions/region-pills";

const titleId = "region-links-title";

type RegionLinksProps = {
  /** `other`: on a region page («в інших областях»); `all`: on every other main page. Both show the one-line lead. */
  variant: "other" | "all";
  /** Id of the current region (content/insolation.ts), left out of the list. */
  exclude?: string;
};

/**
 * Links to the 26 region pages (/cec/{region}/) under the lead form, before
 * the footer: internal linking for search and a way to one's own region from
 * any main page. Not used on /cec/ (it has the map section), legal and
 * service pages.
 */
export function RegionLinks({ variant, exclude }: RegionLinksProps) {
  const locale = getLocale();
  const t = getMessages().regionLinks;
  const title = variant === "other" ? t.otherTitle : t.allTitle;

  return (
    <section aria-labelledby={titleId} className="pt-section-sm lg:pt-section">
      <Container>
        {/* The line spans the content width, not the container's side padding. */}
        <div className="grid grid-cols-1 gap-6 border-t border-line pt-section-sm lg:grid-cols-12 lg:gap-16 lg:pt-section-head">
          <div className="flex flex-col gap-2 lg:col-span-4">
            <Heading
              as="h2"
              size="h3"
              weight="semibold"
              id={titleId}
              className="text-ink"
            >
              {title}
            </Heading>
            <p className="text-small text-muted">{t.text}</p>
          </div>
          <div className="lg:col-span-8">
            <RegionPills locale={locale} exclude={exclude} label={title} />
          </div>
        </div>
      </Container>
    </section>
  );
}
