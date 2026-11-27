import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { PillLink } from "@/components/ui/pill-link";
import { sesPowerPages, sesPowerPath } from "@/content/ses-power";
import { localizePath, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { format } from "@/lib/messages";

const titleId = "power-others-title";

/** «Інші потужності СЕС»: pills to the other power pages; nothing while this is the only one. */
export function PowerOthers({ kw, locale }: { kw: number; locale: Locale }) {
  const others = sesPowerPages.filter((page) => page.kw !== kw);
  if (others.length === 0) return null;
  const t = getMessages().sesPower.others;

  return (
    <section aria-labelledby={titleId} className="pt-section-sm lg:pt-section">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-line pt-section-sm lg:grid-cols-12 lg:gap-16 lg:pt-section-head">
          <Heading as="h2" size="h3" weight="semibold" id={titleId} className="text-ink lg:col-span-4">
            {t.title}
          </Heading>
          <nav aria-label={t.title} className="flex flex-wrap gap-2 lg:col-span-8">
            {others.map((page) => (
              <PillLink key={page.slug} href={localizePath(sesPowerPath(page), locale)} size="compact">
                {format(t.item, { kw: formatNumber(page.kw, locale) })}
              </PillLink>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
