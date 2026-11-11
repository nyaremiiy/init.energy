import {
  ArrowUpRight,
  BatteryCharging,
  Calculator,
  Construction,
  SearchX,
  Sun,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { chipClasses } from "@/components/ui/chip-styles";
import { Description } from "@/components/ui/description";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Panel } from "@/components/ui/panel";
import { anchors, routes, sectionHref } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";

/**
 * 404 screen. Pages that are linked but not built yet say «page in progress»;
 * any other URL says «page not found». Both are a 404 with noindex.
 */
export function NotFoundView({ planned }: { planned: boolean }) {
  const locale = getLocale();
  const t = getMessages().notFound;
  const copy = planned ? t.planned : t.missing;
  const Icon = planned ? Construction : SearchX;

  const quickLinks = [
    { href: localizePath(routes.services.turnkeySes, locale), label: t.links.ses, icon: Sun },
    { href: sectionHref(anchors.products, locale), label: t.links.products, icon: BatteryCharging },
    { href: sectionHref(anchors.calculator, locale), label: t.links.calculator, icon: Calculator },
  ];

  return (
    <main className="flex-1 pb-section-sm lg:pb-section">
      <Panel
        as="section"
        variant="dark"
        aria-labelledby="not-found-title"
        className="pt-panel-sm sm:pt-panel"
        panelClassName="bg-ink-glow shadow-soft"
      >
        <Container
          inPanel
          className="flex flex-col items-start gap-6 pt-28 pb-panel-y-sm lg:pt-36 lg:pb-panel-y"
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-white/25 text-white">
            <Icon aria-hidden className="size-6" />
          </span>
          <Eyebrow tone="dark">{copy.eyebrow}</Eyebrow>
          <Heading
            as="h1"
            id="not-found-title"
            className="max-w-3xl text-hero-sm text-white md:text-hero-md lg:text-hero"
          >
            {copy.title}
          </Heading>
          <Description className="max-w-2xl">{copy.lead}</Description>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              href={localizePath(routes.home, locale)}
              icon={<ArrowUpRight aria-hidden className="size-4.5" />}
            >
              {t.home}
            </Button>
            <Button
              href={sectionHref(anchors.contacts, locale)}
              variant="secondary"
              icon={<ArrowUpRight aria-hidden className="size-4.5" />}
            >
              {t.request}
            </Button>
          </div>

          <nav aria-label={t.available} className="mt-6 w-full border-t border-white/16 pt-6">
            <p className="mb-3 font-heading text-eyebrow-sm font-medium tracking-eyebrow text-white/75 uppercase sm:text-eyebrow">
              {t.available}
            </p>
            <ul className="flex flex-wrap gap-2">
              {quickLinks.map(({ href, label, icon: LinkIcon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`gap-2 ${chipClasses({ selected: false, tone: "dark" })}`}
                  >
                    <LinkIcon aria-hidden className="size-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Panel>
    </main>
  );
}
