import { Layers, RefreshCw, Scale, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CardLabel } from "@/components/ui/card-label";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import type { AdvantageIcon, ProductPage } from "@/content/product-pages";
import { anchors } from "@/content/routes";
import type { Locale } from "@/lib/format";
import { getMessages } from "@/i18n/server";
import { format } from "@/lib/messages";

const icons: Record<AdvantageIcon, typeof ShieldCheck> = {
  safety: ShieldCheck,
  balance: Scale,
  cycles: RefreshCw,
  scale: Layers,
};

/** Same palette steps as the solution cards: sky → surface → navy → ink. */
const tones = {
  sky: {
    card: "bg-sky text-ink",
    muted: "text-ink/70",
    label: "light" as const,
  },
  light: {
    card: "bg-surface text-ink",
    muted: "text-ink/70",
    label: "light" as const,
  },
  navy: {
    card: "bg-navy text-white",
    muted: "text-white/75",
    label: "dark" as const,
  },
  dark: {
    card: "bg-ink text-white",
    muted: "text-white/75",
    label: "dark" as const,
  },
};

const titleId = "product-advantages-title";

export function ProductAdvantages({
  page,
  name,
  locale,
}: {
  page: ProductPage;
  name: string;
  locale: Locale;
}) {
  const messages = getMessages();
  const t = messages.productPage.advantages;

  return (
    <section
      id={anchors.advantages}
      aria-labelledby={titleId}
      className="relative scroll-mt-40 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="SAFETY" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={format(t.title, { name })}
            titleId={titleId}
            lead={page.advantages.lead[locale]}
          />
        </Reveal>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.advantages.items.map((item, index) => {
            const tone = tones[item.tone];
            const Icon = icons[item.icon];

            return (
              <li key={item.title[locale]}>
                <Reveal delay={index * 0.08} className="h-full">
                  <article
                    className={`flex h-full flex-col gap-6 rounded-3xl p-card-sm shadow-card lg:p-card ${tone.card}`}
                  >
                    <CardLabel tone={tone.label} icon={Icon}>
                      {item.tag[locale]}
                    </CardLabel>
                    <p
                      aria-hidden
                      className="font-heading text-number-sm font-light whitespace-nowrap lg:text-number"
                    >
                      {item.figure[locale]}
                    </p>
                    <div className="mt-auto flex flex-col gap-2">
                      <Heading as="h3" size="h3">
                        {item.title[locale]}
                      </Heading>
                      <p className={`text-base leading-relaxed ${tone.muted}`}>
                        {item.text[locale]}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
