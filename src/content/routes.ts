// Single source of URL slugs. Build paths with `toPath`, never hardcode them in JSX.
export const slugs = {
  calculator: "kalkulyator",
  ses: {
    hub: "ses",
    home: "dlya-domu",
    business: "dlya-biznesu",
  },
  backupPower: {
    hub: "rezervne-zhyvlennya",
    apartment: "dlya-kvartyry",
    house: "dlya-budynku",
    business: "dlya-biznesu",
  },
} as const;

export function toPath(...segments: string[]): string {
  return `/${segments.join("/")}`;
}

export const routes = {
  calculator: toPath(slugs.calculator),
  ses: {
    hub: toPath(slugs.ses.hub),
    home: toPath(slugs.ses.hub, slugs.ses.home),
    business: toPath(slugs.ses.hub, slugs.ses.business),
  },
  backupPower: {
    hub: toPath(slugs.backupPower.hub),
    apartment: toPath(slugs.backupPower.hub, slugs.backupPower.apartment),
    house: toPath(slugs.backupPower.hub, slugs.backupPower.house),
    business: toPath(slugs.backupPower.hub, slugs.backupPower.business),
  },
} as const;
