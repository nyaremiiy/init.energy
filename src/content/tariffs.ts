export const updatedAt = "2026-11-11" as const;

export const householdTariff = {
  value: 4.32,
  unit: "UAH/kWh",
  validUntil: "2027-04-30",
  source: "КМУ, рішення від 08.10.2026",
} as const;

export const householdElectricHeating = {
  value: 2.64,
  limitKwhPerMonth: 2000,
  season: "Oct 1 – Apr 30",
  note: "для будинків з електроопаленням; понад 2000 кВт·год — 4,32",
} as const;

export const businessTariff = null;
