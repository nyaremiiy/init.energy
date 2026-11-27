import { Mail } from "lucide-react";

import { Container } from "@/components/layout/container";

import { contactEmail } from "./header-data";
import { LanguageSwitcher } from "./language-switcher";
import { OfficeRotator } from "./office-rotator";
import { RegionsMenu } from "./regions-menu";
import { RegionsPicker } from "./regions-picker";
import { getMessages } from "@/i18n/server";
import { SocialLinks } from "@/components/ui/social-links";

export function HeaderTopBar() {
  const t = getMessages().chrome.header.regions;

  return (
    // z-10 over the main bar (z-0, HeaderShell): the «Регіони» panel opens above it.
    <div className="relative z-10 hidden h-11 border-b border-line-dark text-caption text-muted-dark lg:block">
      <Container inPanel className="flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <RegionsMenu label={t.button}>
            <RegionsPicker variant="panel" />
          </RegionsMenu>
          <span aria-hidden className="h-4 w-px bg-line-dark" />
          <OfficeRotator />
        </div>
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
