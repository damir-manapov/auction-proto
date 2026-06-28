import type { FlightHaulRow } from "@auction/core";

export const FLIGHT_HAULS_DATA: FlightHaulRow[] = [
  {
    id: "ultraShort",
    name: { en: "Ultra-short (<1.5h)", ru: "Ультракороткий (<1.5ч)", uz: "Ultra-qisqa (<1.5s)" },
  },
  { id: "short", name: { en: "Short (1.5–3h)", ru: "Короткий (1.5–3ч)", uz: "Qisqa (1.5–3s)" } },
  { id: "medium", name: { en: "Medium (3–5h)", ru: "Средний (3–5ч)", uz: "O'rta (3–5s)" } },
  { id: "long", name: { en: "Long (5–8h)", ru: "Длинный (5–8ч)", uz: "Uzoq (5–8s)" } },
  {
    id: "ultraLong",
    name: { en: "Ultra-long (8h+)", ru: "Ультрадальний (8ч+)", uz: "Ultra-uzoq (8s+)" },
  },
];
