import { T } from "./theme";
import type { BidState, Channel, FlightHaul, FlightStatus, Tier } from "./types";

export const DIST_DATA: Array<{ range: string; count: number; pct: number; color: string }> = [
  { range: "$500–750", count: 7, pct: 25, color: T.accent },
  { range: "$400–499", count: 10, pct: 36, color: T.accentSoft },
  { range: "$300–399", count: 8, pct: 29, color: T.accentMuted },
  { range: "$262–299", count: 3, pct: 10, color: T.accentPale },
];

export const EXIT_DATA: Array<{ range: string; count: number; pct: number; color: string }> = [
  { range: "$60–85", count: 9, pct: 64, color: T.green },
  { range: "$32–59", count: 5, pct: 36, color: T.greenSoft },
];

export const TIER_META: Record<Tier, { color: string; bg: string; label: string; mult: string }> = {
  Platinum: { color: T.amber, bg: T.amberDim, label: "Platinum", mult: "+10%" },
  Gold: { color: T.accent, bg: T.accentDim, label: "Gold", mult: "+5%" },
  Silver: { color: T.textSub, bg: T.neutralSoft, label: "Silver", mult: "+3%" },
  Standard: { color: T.textMuted, bg: T.neutralPale, label: "Standard", mult: "—" },
};

export const STATE_META: Record<BidState, { label: string; color: string; bg: string }> = {
  pending: { label: "Ожидает", color: T.textMuted, bg: T.neutralSoft },
  approved: { label: "Принята", color: T.greenText, bg: T.greenDim },
  rejected: { label: "Отклонена", color: T.redText, bg: T.redDim },
};

export const STATUS_META: Record<FlightStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Активен", color: T.greenText, bg: T.greenDim },
  sold: { label: "Нет мест", color: T.redText, bg: T.redDim },
  upcoming: { label: "Скоро", color: T.amberText, bg: T.amberDim },
};

export const HAUL_LABELS: Record<FlightHaul, string> = {
  "ultra-short": "Ультракороткий (<1.5ч)",
  short: "Короткий (1.5–3ч)",
  medium: "Средний (3–5ч)",
  long: "Длинный (5–8ч)",
  ultra: "Ультрадальний (8ч+)",
};

export const CH_ICONS: Record<Channel, string> = {
  Email: "✉",
  App: "◉",
  MMB: "⊞",
  Web: "◈",
};
