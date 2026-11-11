import {
  Activity,
  AirVent,
  ArrowUpDown,
  BatteryCharging,
  Cable,
  ConciergeBell,
  CookingPot,
  Droplets,
  Lightbulb,
  type LucideIcon,
  Server,
  ShieldCheck,
  Siren,
  SolarPanel,
  Waves,
  WashingMachine,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";

import type { NicheIcon, NicheTone } from "@/content/solutions";

/** One lucide icon per id used in `solutionPages` (content stays free of UI imports). */
export const nicheIcons: Record<NicheIcon, LucideIcon> = {
  pool: Waves,
  climate: AirVent,
  water: Droplets,
  kitchen: CookingPot,
  laundry: WashingMachine,
  lighting: Lightbulb,
  reception: ConciergeBell,
  security: ShieldCheck,
  server: Server,
  wifi: Wifi,
  emergency: Siren,
  elevator: ArrowUpDown,
  panels: SolarPanel,
  inverter: Zap,
  mounting: Wrench,
  cables: Cable,
  protection: ShieldCheck,
  monitoring: Activity,
  battery: BatteryCharging,
};

/** Card colours: light tones use ink text, navy and ink use white text. */
export const nicheTones: Record<NicheTone, { card: string; muted: string; dark: boolean }> = {
  white: { card: "bg-white text-ink", muted: "text-ink/70", dark: false },
  sky: { card: "bg-sky text-ink", muted: "text-ink/70", dark: false },
  surface: { card: "bg-surface text-ink", muted: "text-ink/70", dark: false },
  navy: { card: "bg-navy text-white", muted: "text-white/75", dark: true },
  ink: { card: "bg-ink text-white", muted: "text-white/75", dark: true },
};
