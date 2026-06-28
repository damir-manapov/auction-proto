import type { FlightStatusRow } from "@auction/core";

export const FLIGHT_STATUSES_DATA: FlightStatusRow[] = [
  {
    id: "active",
    name: { en: "Active", ru: "Активен", uz: "Faol" },
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  {
    id: "sold",
    name: { en: "Sold out", ru: "Нет мест", uz: "Sotildi" },
    colorId: "statusDangerFg",
    bgId: "statusDangerBg",
  },
  {
    id: "upcoming",
    name: { en: "Upcoming", ru: "Скоро", uz: "Yaqinlashmoqda" },
    colorId: "statusWarningFg",
    bgId: "statusWarningBg",
  },
];
