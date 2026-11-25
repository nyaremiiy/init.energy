import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { getLocale, getMessages } from "@/i18n/server";

import { RegionPills, type RegionPageKind } from "./regions/region-pills";
import { RegionLinksSwitch } from "./regions/region-links-switch";

const titleId = "region-links-title";

type RegionLinksProps = {
  /** `other`: on a region page («в інших областях»); `all`: on another main page; `home`: both kinds with a switch. */
  variant: "other" | "all" | "home";
  /** Solar (/cec/{region}/) or backup power (/rezervne-zhyvlennya/{region}/) pages; ignored by `home`. */
  kind?: RegionPageKind;
  /** Id of the current region (content/insolation.ts), left out of the list. */
  exclude?: string;
};

/**
 * Links to the 26 region pages under the lead form, before the footer:
 * internal linking for search and a way to one's own region from any main
 * page. Solar on the solar pages, backup on the backup hub's region pages,
 * SVIT 600 and SVIT HOME; the home page has both behind a switch. Not used on
 * /cec/ and the backup hub (they have their own region sections), legal and
 * service pages.
 */
export function RegionLinks({ variant, kind = "solar", exclude }: RegionLinksProps) {
  const locale = getLocale();
  const t = getMessages().regionLinks;
  const copy =
    variant === "home"
      ? { title: t.homeTitle, text: t.homeText }
      : kind === "backup"
        ? { title: variant === "other" ? t.backupOtherTitle : t.backupAllTitle, text: t.backupText }
        : { title: variant === "other" ? t.otherTitle : t.allTitle, text: t.text };

  return (
    <section aria-labelledby={titleId} className="pt-section-sm lg:pt-section">
      <Container>
        {/* The line spans the content width, not the container's side padding. */}
        <div className="grid grid-cols-1 gap-6 border-t border-line pt-section-sm lg:grid-cols-12 lg:gap-16 lg:pt-section-head">
          <div className="flex flex-col gap-2 lg:col-span-4">
            <Heading as="h2" size="h3" weight="semibold" id={titleId} className="text-ink">
              {copy.title}
            </Heading>
            <p className="text-small text-muted">{copy.text}</p>
          </div>
          <div className="lg:col-span-8">
            {variant === "home" ? (
              <RegionLinksSwitch
                label={t.tabsLabel}
                tabs={[t.tabs.solar, t.tabs.backup]}
                panels={[
                  <RegionPills key="solar" locale={locale} label={t.allTitle} kind="solar" />,
                  <RegionPills key="backup" locale={locale} label={t.backupAllTitle} kind="backup" />,
                ]}
              />
            ) : (
              <RegionPills locale={locale} exclude={exclude} label={copy.title} kind={kind} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
