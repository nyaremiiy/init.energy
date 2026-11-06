// Single source of URL slugs. Build paths with `toPath`, never hardcode them in JSX.
// Page structure mirrors https://init.energy (see docs/ai/CONTEXT.md).
export const slugs = {
  // TODO(content): catalog page with all SVIT products — planned, not built yet.
  catalog: "svit",
  // TODO(content): about page — planned by the owner, not built yet.
  about: "pro-nas",
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
} as const;

/** Home page section anchors. */
export const anchors = {
  aboutUs: "about-us",
  products: "products",
  projects: "projects",
  contacts: "contacts",
} as const;

export function toPath(...segments: string[]): string {
  return segments.length ? `/${segments.join("/")}/` : "/";
}

export function toAnchor(anchor: string): string {
  return `${toPath()}#${anchor}`;
}

export const routes = {
  home: toPath(),
  catalog: toPath(slugs.catalog),
  about: toPath(slugs.about),
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
  sections: {
    products: toAnchor(anchors.products),
    contacts: toAnchor(anchors.contacts),
  },
} as const;
