import type { Locale } from "@/i18n/config";

export const updatedAt = "2026-11-11" as const;

export const monthlyShare = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297] as const;

export type InsolationRegion = { id: string; name: Record<Locale, string>; yield: number };

export const insolationRegions: InsolationRegion[] = [
  { id: "kyivska", name: { uk: "Київська", en: "Kyiv" }, yield: 1120 },
  { id: "lvivska", name: { uk: "Львівська", en: "Lviv" }, yield: 1080 },
  { id: "odeska", name: { uk: "Одеська", en: "Odesa" }, yield: 1320 },
  { id: "dnipropetrovska", name: { uk: "Дніпропетровська", en: "Dnipropetrovsk" }, yield: 1270 },
  { id: "kharkivska", name: { uk: "Харківська", en: "Kharkiv" }, yield: 1210 },
  { id: "zaporizka", name: { uk: "Запорізька", en: "Zaporizhzhia" }, yield: 1340 },
  { id: "mykolaivska", name: { uk: "Миколаївська", en: "Mykolaiv" }, yield: 1330 },
  { id: "khersonska", name: { uk: "Херсонська", en: "Kherson" }, yield: 1360 },
  { id: "poltavska", name: { uk: "Полтавська", en: "Poltava" }, yield: 1190 },
  { id: "cherkaska", name: { uk: "Черкаська", en: "Cherkasy" }, yield: 1200 },
  { id: "vinnytska", name: { uk: "Вінницька", en: "Vinnytsia" }, yield: 1160 },
  { id: "zhytomyrska", name: { uk: "Житомирська", en: "Zhytomyr" }, yield: 1085 },
  { id: "chernihivska", name: { uk: "Чернігівська", en: "Chernihiv" }, yield: 1070 },
  { id: "sumska", name: { uk: "Сумська", en: "Sumy" }, yield: 1100 },
  { id: "kirovohradska", name: { uk: "Кіровоградська", en: "Kirovohrad" }, yield: 1240 },
  { id: "chernivetska", name: { uk: "Чернівецька", en: "Chernivtsi" }, yield: 1110 },
  { id: "ivano-frankivska", name: { uk: "Івано-Франківська", en: "Ivano-Frankivsk" }, yield: 1090 },
  { id: "ternopilska", name: { uk: "Тернопільська", en: "Ternopil" }, yield: 1100 },
  { id: "rivnenska", name: { uk: "Рівненська", en: "Rivne" }, yield: 1060 },
  { id: "volynska", name: { uk: "Волинська", en: "Volyn" }, yield: 1050 },
  { id: "zakarpatska", name: { uk: "Закарпатська", en: "Zakarpattia" }, yield: 1125 },
  { id: "khmelnytska", name: { uk: "Хмельницька", en: "Khmelnytskyi" }, yield: 1115 },
];

export function regionsByLocale(locale: Locale) {
  return [...insolationRegions].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
}
