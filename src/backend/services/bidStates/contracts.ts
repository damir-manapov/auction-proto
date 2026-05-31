import type { BidStateRow } from "../../../types";

export type BidStatesService = {
  list: () => Promise<BidStateRow[]>;
};
