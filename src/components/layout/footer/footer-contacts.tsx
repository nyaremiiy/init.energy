import { Mail, Phone } from "lucide-react";

import { ContactLink } from "@/components/ui/contact-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { companyContacts, offices } from "@/content/company";
import { getLocale, getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";

import { focusClasses } from "./footer-styles";

/**
 * «Contacts» column: every office from content/company.ts (the same source as
 * the Organization JSON-LD), then the email. City/address use muted-dark:
 * faint-dark (white 45%) is below 4.5:1 for small text on ink.
 */
export function FooterContacts() {
  const t = getMessages().footer;
  const locale = getLocale();

  return (
    <address className="not-italic lg:col-span-3">
      <Eyebrow tone="dark" size="compact" as="p" className="mb-5">
        {t.contactsTitle}
      </Eyebrow>
      <div className="flex flex-col gap-4.5">
        {offices.map((office) => (
          <div key={office.phone.href} className="flex flex-col gap-1">
            <p className="text-caption text-muted-dark">
              {office.city[locale]} · {office.address[locale]}
            </p>
            <ContactLink
              href={office.phone.href}
              method="phone"
              location="footer"
              className={`inline-flex min-h-11 w-fit items-center gap-2.5 rounded-sm text-small font-medium whitespace-nowrap text-white tabular-nums underline decoration-transparent underline-offset-4 transition-colors duration-150 ease-tech hover:decoration-current lg:min-h-0 ${focusClasses}`}
            >
              <Phone aria-hidden size={16} strokeWidth={1.7} className="shrink-0" />
              {formatPhone(office.phone.display)}
            </ContactLink>
          </div>
        ))}
        <ContactLink
          href={companyContacts.email.href}
          method="email"
          location="footer"
          className={`inline-flex min-h-11 w-fit items-center gap-2.5 rounded-sm text-small text-muted-dark transition-colors duration-150 ease-tech hover:text-white lg:min-h-0 ${focusClasses}`}
        >
          <Mail aria-hidden size={16} strokeWidth={1.7} className="shrink-0" />
          {companyContacts.email.display}
        </ContactLink>
      </div>
    </address>
  );
}
