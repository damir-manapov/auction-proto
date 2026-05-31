import { COUNTRIES_DATA } from "../data";
import type { Country } from "../types";
import type { CountriesService } from "./contracts";
import type { DbEmulator } from "./db/emulator";
import type { EntitySeed } from "./serviceUtils";

export const countriesSeed: EntitySeed = {
  countries: COUNTRIES_DATA,
};

export function createCountriesService(db: DbEmulator): CountriesService {
  return {
    async listCountries() {
      return db.list<Country>("countries");
    },
  };
}
