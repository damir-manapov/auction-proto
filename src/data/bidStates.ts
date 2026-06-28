import type { BidStateRow } from "../types";

export const BID_STATES_DATA: BidStateRow[] = [
  {
    id: "pending",
    name: { en: "Pending", ru: "Ожидает", uz: "Kutilmoqda" },
    colorId: "textMuted",
    bgId: "neutralBgSoft",
  },
  {
    id: "approved",
    name: { en: "Approved", ru: "Принята", uz: "Qabul qilindi" },
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  {
    id: "rejected",
    name: { en: "Rejected", ru: "Отклонена", uz: "Rad etildi" },
    colorId: "statusDangerFg",
    bgId: "statusDangerBg",
  },
];
