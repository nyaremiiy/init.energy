import { routes } from "./routes";

// TODO(content): these pages are planned but not built yet.
export type SegmentPageId =
  | "backupApartment"
  | "backupHouse"
  | "backupBusiness"
  | "sesHome"
  | "sesBusiness";

export type SegmentPage = {
  id: SegmentPageId;
  name: string;
  href: string;
};

export const segmentPages: Record<SegmentPageId, SegmentPage> = {
  backupApartment: {
    id: "backupApartment",
    name: "Резервне живлення для квартири",
    href: routes.backupPower.apartment,
  },
  backupHouse: {
    id: "backupHouse",
    name: "Резервне живлення для будинку",
    href: routes.backupPower.house,
  },
  backupBusiness: {
    id: "backupBusiness",
    name: "Резервне живлення для бізнесу",
    href: routes.backupPower.business,
  },
  sesHome: {
    id: "sesHome",
    name: "СЕС для дому",
    href: routes.ses.home,
  },
  sesBusiness: {
    id: "sesBusiness",
    name: "СЕС для бізнесу",
    href: routes.ses.business,
  },
};
