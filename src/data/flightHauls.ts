import type { FlightHaulRow } from "../types";

export const FLIGHT_HAULS_DATA: FlightHaulRow[] = [
  { id: "ultra-short", name: { en: "Ultra-short (<1.5h)", ru: "Ультракороткий (<1.5ч)" } },
  { id: "short", name: { en: "Short (1.5–3h)", ru: "Короткий (1.5–3ч)" } },
  { id: "medium", name: { en: "Medium (3–5h)", ru: "Средний (3–5ч)" } },
  { id: "long", name: { en: "Long (5–8h)", ru: "Длинный (5–8ч)" } },
  { id: "ultra", name: { en: "Ultra-long (8h+)", ru: "Ультрадальний (8ч+)" } },
];
