import type { FlightStatusRow, LocalizedString } from "../types";

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

export const flightStatusesTitle: LocalizedString = {
  en: "Flight Statuses",
  ru: "Статусы рейсов",
};

export const FLIGHT_STATUSES_BY_ID = Object.fromEntries(
  FLIGHT_STATUSES_DATA.map((r) => [r.id, r]),
) as Record<FlightStatusRow["id"], FlightStatusRow>;
