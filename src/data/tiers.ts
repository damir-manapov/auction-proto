import type { LocalizedString, TierRow } from "../types";

export const TIERS_DATA: TierRow[] = [
  {
    id: "Platinum",
    name: { en: "Platinum", ru: "Платина" },
    multLabel: { en: "+10%", ru: "+10%" },
  },
  {
    id: "Gold",
    name: { en: "Gold", ru: "Золото" },
    multLabel: { en: "+5%", ru: "+5%" },
  },
  {
    id: "Silver",
    name: { en: "Silver", ru: "Серебро" },
    multLabel: { en: "+3%", ru: "+3%" },
  },
  {
    id: "Standard",
    name: { en: "Standard", ru: "Стандарт" },
    multLabel: { en: "—", ru: "—" },
  },
];

export const tiersTitle: LocalizedString = { en: "Loyalty Tiers", ru: "Статусы лояльности" };

export const TIERS_BY_ID = Object.fromEntries(TIERS_DATA.map((r) => [r.id, r])) as Record<
  TierRow["id"],
  TierRow
>;
