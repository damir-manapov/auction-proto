import type { BidStateRow, LocalizedString } from "../types";

export const BID_STATES_DATA: BidStateRow[] = [
  { id: "pending", name: { en: "Pending", ru: "Ожидает" } },
  { id: "approved", name: { en: "Approved", ru: "Принята" } },
  { id: "rejected", name: { en: "Rejected", ru: "Отклонена" } },
];

export const bidStatesTitle: LocalizedString = { en: "Bid States", ru: "Состояния заявок" };

export const BID_STATES_BY_ID = Object.fromEntries(BID_STATES_DATA.map((r) => [r.id, r])) as Record<
  BidStateRow["id"],
  BidStateRow
>;
