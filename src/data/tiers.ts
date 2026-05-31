import type { TierRow } from "../types";

export const TIERS_DATA: TierRow[] = [
  {
    id: "Platinum",
    name: { en: "Platinum", ru: "Платина" },
    multLabel: { en: "+10%", ru: "+10%" },
    colorId: "statusWarning",
    bgId: "statusWarningBg",
  },
  {
    id: "Gold",
    name: { en: "Gold", ru: "Золото" },
    multLabel: { en: "+5%", ru: "+5%" },
    colorId: "brandPrimary",
    bgId: "brandPrimaryBg",
  },
  {
    id: "Silver",
    name: { en: "Silver", ru: "Серебро" },
    multLabel: { en: "+3%", ru: "+3%" },
    colorId: "textSecondary",
    bgId: "neutralBgSoft",
  },
  {
    id: "Standard",
    name: { en: "Standard", ru: "Стандарт" },
    multLabel: { en: "—", ru: "—" },
    colorId: "textMuted",
    bgId: "neutralBgPale",
  },
];
