import type { BidState } from "../types";
import type { ColorTokenId } from "./color";

export const STATE_META: Record<BidState, { colorId: ColorTokenId; bgId: ColorTokenId }> = {
  pending: { colorId: "textMuted", bgId: "neutralBgSoft" },
  approved: { colorId: "statusSuccessFg", bgId: "statusSuccessBg" },
  rejected: { colorId: "statusDangerFg", bgId: "statusDangerBg" },
};
