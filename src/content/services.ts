import type { Localized } from "@/i18n/config";

import { routes } from "./routes";

// Source: https://init.energy (checked 2026-11-06).
export type ServiceId = "turnkeySes" | "hotelSes";

export type Service = {
  id: ServiceId;
  name: Localized;
  href: string;
  summary: Localized;
};

export const services: Record<ServiceId, Service> = {
  turnkeySes: {
    id: "turnkeySes",
    name: { uk: "СЕС під ключ", en: "Turnkey solar plants" },
    href: routes.services.turnkeySes,
    summary: {
      uk: "Проєктування та монтаж для бізнесу й приватних об'єктів",
      en: "Design and installation for businesses and private sites",
    },
  },
  hotelSes: {
    id: "hotelSes",
    name: {
      uk: "СЕС для готелю та відпочинкового комплексу",
      en: "Solar for hotels and resorts",
    },
    href: routes.sesNiche.hotel,
    summary: {
      uk: "Енергонезалежність для готелів і баз відпочинку",
      en: "Energy independence for hotels and holiday resorts",
    },
  },
};
