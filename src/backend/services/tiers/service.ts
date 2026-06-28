import { TIERS_DATA } from "../../../data/tiers";
import type { LocalizedString, TierRow } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { TiersService } from "./contracts";

export const tiersSeed: EntitySeed = {
  tiers: TIERS_DATA,
};

export const tiersTitle: LocalizedString = {
  en: "Loyalty Tiers",
  ru: "Статусы лояльности",
  uz: "Sadoqat darajalari",
};

export function createTiersService(db: DbEmulator): TiersService {
  return {
    async list() {
      return db.list<TierRow>("tiers");
    },
  };
}
