import { Mail } from "lucide-react";

import { ContactLink } from "@/components/ui/contact-link";
import { IconButton } from "@/components/ui/icon-button";
import { companyContacts, offices } from "@/content/company";
import { format } from "@/i18n/messages";
import { getMessages } from "@/i18n/server";
import { formatPhone } from "@/lib/format";

const trackingLocation = "lead_section";

/**
 * Contacts at the bottom of the lead section's dark photo panel: the phone of
 * every office that has one (only Lviv: the Kyiv office has none) and the email.
 */
export function LeadContactCard() {
  const t = getMessages().leadSection.contactCard;

  return (
    <address className="flex w-full flex-col gap-4 border-t border-line-dark pt-7 not-italic text-white @container">
      <p className="text-small text-muted-dark">{t.prompt}</p>

      <div className="flex flex-col gap-3">
        {offices.map((office) => {
          if (!office.phone) return null;
          const phone = formatPhone(office.phone.display);
          return (
            <ContactLink
              key={office.id}
              href={office.phone.href}
              method="phone"
              location={trackingLocation}
              aria-label={format(t.callLabel, { phone })}
              className="group flex w-fit items-center gap-4 rounded-tile focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <IconButton
                decorative
                variant="solid-light"
                size="sm"
                icon="phone"
                className="transition-transform duration-200 ease-tech motion-safe:group-hover:scale-105"
              />
              {/* Container-query sizes (18 → 24 → 30 px): never wraps or overflows, 360 px included. */}
              <span className="font-heading text-lead font-medium whitespace-nowrap tabular-nums @xs:text-h3 @md:text-h2-sm">
                {phone}
              </span>
            </ContactLink>
          );
        })}
      </div>

      <ContactLink
        href={companyContacts.email.href}
        method="email"
        location={trackingLocation}
        className="inline-flex w-fit items-center gap-2.5 text-small text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <Mail aria-hidden size={20} strokeWidth={1.7} className="shrink-0" />
        {companyContacts.email.display}
      </ContactLink>
    </address>
  );
}
