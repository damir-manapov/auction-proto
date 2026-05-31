import type { TierRow } from "../../../types";

export type TiersService = {
  list: () => Promise<TierRow[]>;
};
