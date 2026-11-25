import {
  BatteryCharging,
  Building2,
  Droplets,
  Ellipsis,
  Factory,
  Flame,
  Hotel,
  House,
  HousePlus,
  Landmark,
  Laptop,
  Lightbulb,
  Refrigerator,
  Server,
  Smartphone,
  Sun,
  Warehouse,
  Wifi,
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

/** «What it powers» icons on the home solution cards (content/solutions.ts → loads). */
export type LoadIconId =
  | "router" | "light" | "laptop" | "phone"
  | "boiler" | "pump" | "fridge" | "solar"
  | "factory" | "warehouse" | "hotel" | "critical";

export const loadIcons: Record<LoadIconId, LucideIcon> = {
  router: Wifi,
  light: Lightbulb,
  laptop: Laptop,
  phone: Smartphone,
  boiler: Flame,
  pump: Droplets,
  fridge: Refrigerator,
  solar: Sun,
  factory: Factory,
  warehouse: Warehouse,
  hotel: Hotel,
  critical: Server,
};
