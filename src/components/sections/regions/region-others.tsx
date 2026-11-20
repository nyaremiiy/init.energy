import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import type { InsolationRegion } from "@/content/insolation";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

import { RegionPills } from "./region-pills";

const titleId = "region-others-title";

/** «Сонячні панелі в інших областях»: links to the other 25 region pages. */
export function RegionOthers({ region, locale }: { region: InsolationRegion; locale: Locale }) {
  const t = getMessages().regionPage.others;

  return (
    <section aria-labelledby={titleId} className="pt-section-sm lg:pt-section">
      <Container className="grid grid-cols-1 gap-6 border-t border-line pt-section-sm lg:grid-cols-12 lg:gap-16 lg:pt-section-head">
        <Heading as="h2" size="h3" weight="semibold" id={titleId} className="text-ink lg:col-span-4">
          {t.title}
        </Heading>
        <div className="lg:col-span-8">
          <RegionPills locale={locale} exclude={region.id} label={t.label} />
        </div>
      </Container>
    </section>
  );
}
