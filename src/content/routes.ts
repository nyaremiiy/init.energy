// Single source of URL slugs. Build paths with `toPath`, never hardcode them in JSX.
// Slugs match the current init.energy site to preserve indexed pages.
export const slugs = {
  // TODO(content): calculator page does not exist on init.energy yet.
  calculator: "kalkulyator",
  products: {
    svit600: "svit-600",
    svitPlus5000: "svit-plus-5000",
    svitPlus16000: "svit-plus-16000",
    svitHome: "svit-home",
    lithiumvalley: "bess",
  },
  services: {
    turnkeySes: "cec",
  },
  solutions: {
    hub: "rishennya",
    hotelSes: "ses-dlya-gotelyu",
  },
  // TODO(content): segment pages below do not exist on init.energy yet.
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
  return `/${segments.join("/")}/`;
}

export const routes = {
  calculator: toPath(slugs.calculator),
  products: {
    svit600: toPath(slugs.products.svit600),
    svitPlus5000: toPath(slugs.products.svitPlus5000),
    svitPlus16000: toPath(slugs.products.svitPlus16000),
    svitHome: toPath(slugs.products.svitHome),
    lithiumvalley: toPath(slugs.products.lithiumvalley),
  },
  services: {
    turnkeySes: toPath(slugs.services.turnkeySes),
  },
  solutions: {
    hotelSes: toPath(slugs.solutions.hub, slugs.solutions.hotelSes),
  },
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
