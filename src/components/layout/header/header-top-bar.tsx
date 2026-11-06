import { Mail } from "lucide-react";

import { Container } from "@/components/layout/container";

import { contactEmail } from "./header-data";
import { LanguageSwitcher } from "./language-switcher";
import { OfficeRotator } from "./office-rotator";
import { SocialLinks } from "./social-links";

export function HeaderTopBar() {
  return (
    <div className="hidden h-11 border-b border-white/15 text-xs text-white/80 lg:block">
      <Container className="flex h-full items-center justify-between gap-6">
        <OfficeRotator />
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail aria-hidden className="size-3.5 shrink-0" />
            {contactEmail}
          </a>
          <SocialLinks />
          <LanguageSwitcher />
        </div>
      </Container>
    </div>
  );
}
