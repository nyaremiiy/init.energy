import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactLink } from "@/components/ui/contact-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mainPhone } from "@/content/company";
import { routes } from "@/content/routes";
import { localizePath } from "@/i18n/config";
import { getLocale, getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";

import { focusClasses } from "./footer-styles";

/**
 * First row of the footer: «Let's start with a calculation» + a phone and the
 * calculator button. The title is a <p>: the footer adds no headings to the page outline.
 */
export function FooterCta() {
  const t = getMessages().footer.cta;
  const locale = getLocale();
  const phone = mainPhone;

  return (
    <div className="flex flex-col gap-8 border-b border-line-dark pb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div className="flex max-w-160 flex-col gap-5">
        <Eyebrow tone="dark" size="compact" as="p">
          {t.eyebrow}
        </Eyebrow>
        <p className="font-heading text-h2-sm font-semibold tracking-tight text-white lg:text-h2-md">{t.title}</p>
      </div>

      {/* Mobile: the button first (full width), the phone under it. */}
      <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-end lg:gap-7">
        <ContactLink
          href={phone.href}
          method="phone"
          location="footer_cta"
          aria-label={`${t.callCaption} ${formatPhone(phone.display)}`}
          className={`group flex flex-col gap-0.5 rounded-sm ${focusClasses}`}
        >
          <span className="text-caption text-muted-dark">{t.callCaption}</span>
          <span className="font-heading text-lead font-semibold whitespace-nowrap text-white tabular-nums underline decoration-transparent underline-offset-4 transition-colors duration-150 ease-tech group-hover:decoration-current">
            {formatPhone(phone.display)}
          </span>
        </ContactLink>
        <Button
          href={localizePath(routes.calculators.sesPayback, locale)}
          variant="primary"
          size="lg"
          className="w-full lg:w-auto"
          icon={<ArrowUpRight aria-hidden className="size-4.5" />}
        >
          {t.button}
        </Button>
      </div>
    </div>
  );
}
