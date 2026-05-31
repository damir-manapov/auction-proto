import type { Tier } from "../types";
import type { ColorTokenId } from "./color";

export const TIER_META: Record<Tier, { colorId: ColorTokenId; bgId: ColorTokenId }> = {
  Platinum: { colorId: "statusWarning", bgId: "statusWarningBg" },
  Gold: { colorId: "brandPrimary", bgId: "brandPrimaryBg" },
  Silver: { colorId: "textSecondary", bgId: "neutralBgSoft" },
  Standard: { colorId: "textMuted", bgId: "neutralBgPale" },
};
