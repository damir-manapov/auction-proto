import { AIRPORTS_DATA } from "../data";
import type { Airport } from "../types";
import type { AirportsService } from "./contracts";
import type { DbEmulator } from "./db/emulator";
import type { EntitySeed } from "./serviceUtils";

export const airportsSeed: EntitySeed = {
  airports: AIRPORTS_DATA,
};

export function createAirportsService(db: DbEmulator): AirportsService {
  return {
    async list() {
      return db.list<Airport>("airports");
    },
    async findByIds(ids) {
      if (ids.length === 0) return [];
      return db.queryAll<Airport>("airports", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
    },
  };
}
