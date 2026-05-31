import type { BackendClient, EntitiesService } from "./contracts";
import { createDbEmulator, type DbEmulator } from "./db/emulator";
import { airportsSeed, airportsTitle, createAirportsService } from "./services/airports/service";
import { bidsSeed, bidsTitle, createBidsService } from "./services/bids/service";
import { citiesSeed, citiesTitle, createCitiesService } from "./services/cities/service";
import {
  countriesSeed,
  countriesTitle,
  createCountriesService,
} from "./services/countries/service";
import { createFlightsService, flightsSeed, flightsTitle } from "./services/flights/service";
import {
  createPassengersService,
  passengersSeed,
  passengersTitle,
} from "./services/passengers/service";
import { BID_STATES_DATA, bidStatesTitle } from "../data/bidStates";
import { FLIGHT_HAULS_DATA, flightHaulsTitle } from "../data/flightHauls";
import { FLIGHT_STATUSES_DATA, flightStatusesTitle } from "../data/flightStatuses";
import { TIERS_DATA, tiersTitle } from "../data/tiers";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";
import type { LocalizedString } from "../types";

function createEntitiesService(
  db: DbEmulator,
  titles: Record<string, LocalizedString>,
): EntitiesService {
  return {
    async listAll() {
      return db.tableNames().map((name) => ({
        name,
        title: titles[name] ?? { en: name, ru: name },
        rows: db.list(name),
      }));
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
    ...passengersSeed,
    tiers: TIERS_DATA,
    bidStates: BID_STATES_DATA,
    flightStatuses: FLIGHT_STATUSES_DATA,
    flightHauls: FLIGHT_HAULS_DATA,
  });

  const entityTitles: Record<string, LocalizedString> = {
    flights: flightsTitle,
    bids: bidsTitle,
    airports: airportsTitle,
    cities: citiesTitle,
    countries: countriesTitle,
    passengers: passengersTitle,
    tiers: tiersTitle,
    bidStates: bidStatesTitle,
    flightStatuses: flightStatusesTitle,
    flightHauls: flightHaulsTitle,
  };

  const baseClient: BackendClient = {
    flights: createFlightsService(db),
    bids: createBidsService(db),
    airports: createAirportsService(db),
    cities: createCitiesService(db),
    countries: createCountriesService(db),
    passengers: createPassengersService(db),
    entities: createEntitiesService(db, entityTitles),
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
