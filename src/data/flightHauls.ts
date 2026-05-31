import type { FlightHaulRow, LocalizedString } from "../types";

export const FLIGHT_HAULS_DATA: FlightHaulRow[] = [
  { id: "ultra-short", name: { en: "Ultra-short (<1.5h)", ru: "Ультракороткий (<1.5ч)" } },
  { id: "short", name: { en: "Short (1.5–3h)", ru: "Короткий (1.5–3ч)" } },
  { id: "medium", name: { en: "Medium (3–5h)", ru: "Средний (3–5ч)" } },
  { id: "long", name: { en: "Long (5–8h)", ru: "Длинный (5–8ч)" } },
  { id: "ultra", name: { en: "Ultra-long (8h+)", ru: "Ультрадальний (8ч+)" } },
];

export const flightHaulsTitle: LocalizedString = { en: "Flight Hauls", ru: "Типы перелётов" };

export const FLIGHT_HAULS_BY_ID = Object.fromEntries(
  FLIGHT_HAULS_DATA.map((r) => [r.id, r]),
) as Record<FlightHaulRow["id"], FlightHaulRow>;
