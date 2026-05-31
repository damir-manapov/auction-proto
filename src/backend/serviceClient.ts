import { airportsSeed, createAirportsService } from "./airportsService";
import { bidsSeed, createBidsService } from "./bidsService";
import { citiesSeed, createCitiesService } from "./citiesService";
import type { BackendClient, EntitiesService } from "./contracts";
import { countriesSeed, createCountriesService } from "./countriesService";
import { createDbEmulator, type DbEmulator } from "./db/emulator";
import { flightsSeed, createFlightsService } from "./flightsService";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

function createEntitiesService(db: DbEmulator): EntitiesService {
  return {
    async listAll() {
      return db.tableNames().map((name) => ({ name, rows: db.list(name) }));
    },
  };
}

export const createServiceClient = (): BackendClient => {
  const db = createDbEmulator({
    ...flightsSeed,
    ...bidsSeed,
    ...airportsSeed,
    ...citiesSeed,
    ...countriesSeed,
  });

  const baseClient: BackendClient = {
    flights: createFlightsService(db),
    bids: createBidsService(db),
    airports: createAirportsService(db),
    cities: createCitiesService(db),
    countries: createCountriesService(db),
    entities: createEntitiesService(db),
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
