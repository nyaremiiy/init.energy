import {
  BatteryCharging,
  Building2,
  Factory,
  House,
  HousePlus,
  Sun,
  type LucideIcon,
} from "lucide-react";

/** Audience segments shown as card labels; one icon per segment across the site. */
export type SegmentIconId =
  "apartment" | "house" | "homeBusiness" | "autonomous" | "business" | "solar";

export const segmentIcons: Record<SegmentIconId, LucideIcon> = {
  apartment: Building2,
  house: House,
  homeBusiness: HousePlus,
  autonomous: BatteryCharging,
  business: Factory,
  solar: Sun,
};
