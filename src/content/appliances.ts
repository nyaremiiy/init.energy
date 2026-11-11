import type { Locale } from "@/i18n/config";

export const updatedAt = "2026-11-11" as const;

export type Appliance = { id: string; name: Record<Locale, string>; powerW: number; source: string };

export const appliances: Appliance[] = [
  { id: "boiler", name: { uk: "Котел (газовий)", en: "Gas boiler" }, powerW: 60, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "fridge", name: { uk: "Холодильник", en: "Fridge" }, powerW: 150, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "lights", name: { uk: "Світло (10 LED-ламп)", en: "Lights (10 LED bulbs)" }, powerW: 100, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "router", name: { uk: "Роутер", en: "Router" }, powerW: 8, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "pump", name: { uk: "Насос (свердловинний)", en: "Well pump" }, powerW: 750, source: "типова модель 0,75 кВт" },
  { id: "stove", name: { uk: "Електроплита", en: "Electric stove" }, powerW: 1000, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "ac", name: { uk: "Кондиціонер", en: "Air conditioner" }, powerW: 750, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "tv", name: { uk: "Телевізор", en: "TV" }, powerW: 100, source: "index.minfin.com.ua/ua/calc/power" },
  { id: "laptop", name: { uk: "Ноутбук", en: "Laptop" }, powerW: 60, source: "index.minfin.com.ua/ua/calc/power" },
];

export const defaultApplianceIds = ["boiler", "fridge", "lights", "router"] as const;
