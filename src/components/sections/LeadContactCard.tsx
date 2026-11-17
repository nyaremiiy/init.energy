import { Mail, MapPin } from "lucide-react";

import { ContactLink } from "@/components/ui/contact-link";
import { IconButton } from "@/components/ui/icon-button";
import { companyContacts, offices } from "@/content/company";
import { format } from "@/i18n/messages";
import { getLocale, getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";

const trackingLocation = "lead_section";

type LeadContactCardProps = {
  /** "card": own dark card. "inline": no card, a top border (inside the dark photo panel). */
  variant?: "card" | "inline";
};

/** Main phone, email and the Lviv office address (dark). */
export function LeadContactCard({ variant = "card" }: LeadContactCardProps) {
  const locale = getLocale();
  const t = getMessages().leadSection.contactCard;
  const office = offices[0];
  const phone = formatPhone(office.phone.display);
  const inline = variant === "inline";
  // TODO(content): verify the official English spelling of the address.
  const address =
    locale === "en"
      ? `${office.address.en}, ${office.city.en}`
      : `${office.city.uk}, ${office.address.uk}`;

  return (
    <address
      className={`flex w-full flex-col gap-4 not-italic text-white @container ${
        inline ? "border-t border-line-dark pt-7" : "rounded-card bg-ink p-card-sm lg:p-card"
      }`}
    >
      <p className="text-small text-muted-dark">{t.prompt}</p>

      <ContactLink
        href={office.phone.href}
        method="phone"
        location={trackingLocation}
        aria-label={format(t.callLabel, { phone })}
        className={`group flex items-center gap-4 rounded-tile focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
          inline ? "" : "justify-between"
        }`}
      >
        {inline ? (
          <IconButton
            decorative
            variant="solid-light"
            size="md"
            icon="phone"
            className="transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105"
          />
        ) : null}
        {/* Container-query sizes: the number never wraps or overflows (360 px included). Inline: the 48 px circle sits in the same row, so each step is one size smaller. */}
        <span
          className={`font-heading font-medium whitespace-nowrap tabular-nums ${
            inline
              ? "text-lead @xs:text-h3 @sm:text-h2-sm @md:text-h2-md @md:tracking-tight"
              : "text-h3-sm @xs:text-h3 @sm:text-h2-sm @md:text-h2-md @lg:text-h2 @lg:tracking-tight"
          }`}
        >
          {phone}
        </span>
        {inline ? null : (
          <IconButton
            decorative
            variant="solid-light"
            size="md"
            icon="phone"
            className="transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105"
          />
        )}
      </ContactLink>

      <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 ${inline ? "" : "border-t border-line-dark pt-4"}`}>
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
          className="inline-flex items-center gap-2.5 text-small text-muted-dark transition-colors duration-150 ease-tech hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <MapPin aria-hidden size={20} strokeWidth={1.7} className="shrink-0" />
          {address}
        </a>
      </div>
    </address>
  );
}
