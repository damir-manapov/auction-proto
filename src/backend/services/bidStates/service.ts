import { BID_STATES_DATA } from "../../../data/bidStates";
import type { BidStateRow, LocalizedString } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { BidStatesService } from "./contracts";

export const bidStatesSeed: EntitySeed = {
  bidStates: BID_STATES_DATA,
};

export const bidStatesTitle: LocalizedString = { en: "Bid States", ru: "Состояния заявок" };

export function createBidStatesService(db: DbEmulator): BidStatesService {
  return {
    async list() {
      return db.list<BidStateRow>("bidStates");
    },
  };
}
