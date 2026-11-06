import { routes } from "./routes";

// Source: https://init.energy (checked 2026-11-06).
export type ServiceId = "turnkeySes" | "hotelSes";

export type Service = {
  id: ServiceId;
  name: string;
  href: string;
  summary: string;
};

export const services: Record<ServiceId, Service> = {
  turnkeySes: {
    id: "turnkeySes",
    name: "СЕС під ключ",
    href: routes.services.turnkeySes,
    summary: "Проєктування та монтаж для бізнесу й приватних об'єктів",
  },
  hotelSes: {
    id: "hotelSes",
    name: "СЕС для готелю та відпочинкового комплексу",
    href: routes.solutions.hotelSes,
    summary: "Енергонезалежність для готелів і баз відпочинку",
  },
};
