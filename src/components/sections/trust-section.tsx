import { TrustBlock } from "@/components/sections/trust-block";
import { trust } from "@/content/company";
import { anchors, routes } from "@/content/routes";
import { getLocale, getMessages } from "@/i18n/server";

/** «Про компанію» with the company facts; the same block on every page. */
export function TrustSection() {
  const locale = getLocale();
  const t = getMessages().trust;

  return (
    <TrustBlock
      id={anchors.aboutUs}
      titleId="trust-title"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      link={{ href: routes.about, label: t.aboutLink }}
      stats={trust.stats.map((stat) => ({
        id: stat.id,
        value: stat.value[locale],
        label: stat.label[locale],
      }))}
      arguments={trust.arguments.map((argument) => ({
        id: argument.id,
        title: argument.title[locale],
        description: argument.description[locale],
      }))}
      image={
        trust.image
          ? { ...trust.image, alt: trust.image.alt[locale] }
          : undefined
      }
      photoPendingCaption={t.photoPending}
    />
  );
}
