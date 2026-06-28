import type { TierRow } from "@auction/core";

export const TIERS_DATA: TierRow[] = [
  {
    id: "platinum",
    name: { en: "Platinum", ru: "Платина", uz: "Platina" },
    multLabel: { en: "+10%", ru: "+10%", uz: "+10%" },
    colorId: "statusWarning",
    bgId: "statusWarningBg",
  },
  {
    id: "gold",
    name: { en: "Gold", ru: "Золото", uz: "Oltin" },
    multLabel: { en: "+5%", ru: "+5%", uz: "+5%" },
    colorId: "brandPrimary",
    bgId: "brandPrimaryBg",
  },
  {
    id: "silver",
    name: { en: "Silver", ru: "Серебро", uz: "Kumush" },
    multLabel: { en: "+3%", ru: "+3%", uz: "+3%" },
    colorId: "textSecondary",
    bgId: "neutralBgSoft",
  },
  {
    id: "standard",
    name: { en: "Standard", ru: "Стандарт", uz: "Standart" },
    multLabel: { en: "—", ru: "—", uz: "—" },
    colorId: "textMuted",
    bgId: "neutralBgPale",
  },
];
