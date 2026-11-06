import { Mail } from "lucide-react";

import { Container } from "@/components/layout/container";

import { contactEmail } from "./header-data";
import { LanguageSwitcher } from "./language-switcher";
import { OfficeRotator } from "./office-rotator";

export function HeaderTopBar() {
  return (
    <div className="hidden border-b border-white/15 text-sm text-white/80 lg:block">
      <Container className="flex h-11 items-center justify-between gap-6">
        <OfficeRotator />
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail aria-hidden className="size-4 shrink-0" />
            {contactEmail}
          </a>
          <LanguageSwitcher />
        </div>
      </Container>
    </div>
  );
}
