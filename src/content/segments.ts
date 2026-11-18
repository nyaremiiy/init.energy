import {
  BatteryCharging,
  Building2,
  Ellipsis,
  Factory,
  Hotel,
  House,
  HousePlus,
  Landmark,
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

/** Object types in the lead form (same ids as LeadObjectType); icons for the type tiles. */
export type ObjectTypeId = "apartment" | "house" | "business" | "hotel" | "infrastructure" | "other";

export const objectTypeIcons: Record<ObjectTypeId, LucideIcon> = {
  apartment: segmentIcons.apartment,
  house: segmentIcons.house,
  business: segmentIcons.business,
  hotel: Hotel,
  infrastructure: Landmark,
  other: Ellipsis,
};
