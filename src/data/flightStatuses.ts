import type { FlightStatusRow } from "../types";

export const FLIGHT_STATUSES_DATA: FlightStatusRow[] = [
  {
    id: "active",
    name: { en: "Active", ru: "Активен" },
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  {
    id: "sold",
    name: { en: "Sold out", ru: "Нет мест" },
    colorId: "statusDangerFg",
    bgId: "statusDangerBg",
  },
  {
    id: "upcoming",
    name: { en: "Upcoming", ru: "Скоро" },
    colorId: "statusWarningFg",
    bgId: "statusWarningBg",
  },
];
