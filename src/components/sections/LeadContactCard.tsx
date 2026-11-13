import { Mail, MapPin, Phone } from "lucide-react";

import { ContactLink } from "@/components/ui/contact-link";
import { companyContacts, offices } from "@/content/company";
import { format } from "@/i18n/messages";
import { getLocale, getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";

const trackingLocation = "lead_section";

/** Dark card under the lead steps: main phone, email and Lviv office address. */
export function LeadContactCard() {
  const locale = getLocale();
  const t = getMessages().leadSection.contactCard;
  const office = offices[0];
  const phone = formatPhone(office.phone.display);
  // TODO(content): verify the official English spelling of the address.
  const address =
    locale === "en"
      ? `${office.address.en}, ${office.city.en}`
      : `${office.city.uk}, ${office.address.uk}`;

  return (
    <address className="flex w-full flex-col gap-4 rounded-3xl bg-ink p-card-sm not-italic text-white @container lg:p-card">
      <p className="text-small text-white/75">{t.prompt}</p>

      <ContactLink
        href={office.phone.href}
        method="phone"
        location={trackingLocation}
        aria-label={format(t.callLabel, { phone })}
        className="group flex items-center justify-between gap-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="font-sans text-h3-sm font-medium whitespace-nowrap tabular-nums @xs:text-h3 @sm:text-h2-sm @md:text-h2-md @lg:text-h2 @lg:tracking-tight">
          {phone}
        </span>
        <span
          aria-hidden
          className="flex size-13 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105"
        >
          <Phone size={20} strokeWidth={1.7} />
        </span>
      </ContactLink>

      <div className="flex flex-col gap-3 border-t border-white/14 pt-4 sm:flex-row sm:flex-wrap sm:gap-x-6">
        <ContactLink
          href={companyContacts.email.href}
          method="email"
          location={trackingLocation}
          className="inline-flex items-center gap-2.5 text-small text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Mail aria-hidden size={20} strokeWidth={1.7} className="shrink-0" />
          {companyContacts.email.display}
        </ContactLink>
        <a
          href={office.mapHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2.5 text-small text-white/75 transition-colors duration-150 ease-tech hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <MapPin
            aria-hidden
            size={20}
            strokeWidth={1.7}
            className="shrink-0"
          />
          {address}
        </a>
      </div>
    </address>
  );
}
