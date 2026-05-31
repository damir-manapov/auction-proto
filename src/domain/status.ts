import type { FlightStatus } from "../types";
import type { ColorTokenId } from "./color";

export const STATUS_META: Record<FlightStatus, { colorId: ColorTokenId; bgId: ColorTokenId }> = {
  active: { colorId: "statusSuccessFg", bgId: "statusSuccessBg" },
  sold: { colorId: "statusDangerFg", bgId: "statusDangerBg" },
  upcoming: { colorId: "statusWarningFg", bgId: "statusWarningBg" },
};
