import type { Localized } from "@/i18n/config";

/**
 * Partner brands we sell, install and service besides SVIT (owner, 2026-11-25:
 * «беремося за будь-яке рішення, зокрема на обладнанні інших брендів»).
 * Shown as text, no logos. One list for the home storage tabs, the backup hub
 * equipment section and the backup region pages, so the names never diverge.
 */
export type PartnerBrand = {
  id: "deye" | "victron" | "huawei";
  name: string;
  description: Localized;
};

export const partnerBrands: PartnerBrand[] = [
  {
    id: "deye",
    name: "Deye",
    description: { uk: "Гібридні інвертори й акумулятори", en: "Hybrid inverters and batteries" },
  },
  {
    id: "victron",
    name: "Victron",
    // TODO(content): власник звіряє, які саме позиції Victron продаємо.
    description: { uk: "Інвертори, зарядні пристрої й акумулятори", en: "Inverters, chargers and batteries" },
  },
  {
    id: "huawei",
    name: "Huawei",
    // TODO(content): власник звіряє, які саме позиції Huawei продаємо.
    description: { uk: "Гібридні інвертори й батареї", en: "Hybrid inverters and batteries" },
  },
];

/** «Deye · Victron · Huawei». */
export const partnerBrandNames = partnerBrands.map((brand) => brand.name).join(" · ");
