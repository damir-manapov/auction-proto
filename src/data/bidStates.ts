import type { BidStateRow } from "../types";

export const BID_STATES_DATA: BidStateRow[] = [
  {
    id: "pending",
    name: { en: "Pending", ru: "Ожидает" },
    colorId: "textMuted",
    bgId: "neutralBgSoft",
  },
  {
    id: "approved",
    name: { en: "Approved", ru: "Принята" },
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  {
    id: "rejected",
    name: { en: "Rejected", ru: "Отклонена" },
    colorId: "statusDangerFg",
    bgId: "statusDangerBg",
  },
];
