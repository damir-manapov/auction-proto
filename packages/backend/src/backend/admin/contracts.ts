import type { LocalizedString } from "@auction/core";
import type { DbRow } from "../db/contracts";
import type { AirportsService } from "../services/airports/contracts";
import type { BidsService } from "../services/bids/contracts";
import type { BidStatesService } from "../services/bidStates/contracts";
import type { CitiesService } from "../services/cities/contracts";
import type { CountriesService } from "../services/countries/contracts";
import type { FlightHaulsService } from "../services/flightHauls/contracts";
import type { FlightStatusesService } from "../services/flightStatuses/contracts";
import type { FlightsService } from "../services/flights/contracts";
import type { PassengersService } from "../services/passengers/contracts";
import type { RulesService } from "../services/rules/contracts";
import type { TiersService } from "../services/tiers/contracts";

export type EntityTable = {
  name: string;
  title: LocalizedString;
  rows: DbRow[];
};

export type EntitiesService = {
  listAll: () => Promise<EntityTable[]>;
};

/**
 * Admin backend surface: full authority over flight operations, bid moderation,
 * global rules and raw entity tables, plus ownership of all reference data.
 */
export type AdminBackendClient = {
  flights: FlightsService;
  bids: BidsService;
  rules: RulesService;
  entities: EntitiesService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
  passengers: PassengersService;
  tiers: TiersService;
  bidStates: BidStatesService;
  flightStatuses: FlightStatusesService;
  flightHauls: FlightHaulsService;
};
