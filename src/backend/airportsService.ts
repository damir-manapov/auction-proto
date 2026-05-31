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
    async listAirports() {
      return db.list<Airport>("airports");
    },
  };
}
