import type { LocalizedString } from "../types";
import type { DbRow } from "./db/contracts";
import type { AirportsService } from "./services/airports/contracts";
import type { BidsService } from "./services/bids/contracts";
import type { BidStatesService } from "./services/bidStates/contracts";
import type { CitiesService } from "./services/cities/contracts";
import type { CountriesService } from "./services/countries/contracts";
import type { FlightHaulsService } from "./services/flightHauls/contracts";
import type { FlightStatusesService } from "./services/flightStatuses/contracts";
import type { FlightsService } from "./services/flights/contracts";
import type { PassengersService } from "./services/passengers/contracts";
import type { TiersService } from "./services/tiers/contracts";

export type {
  FlightFilter,
  FlightQuery,
  FlightsPage,
  FlightsService,
  FlightsSummary,
} from "./services/flights/contracts";
export type { BidsService } from "./services/bids/contracts";
export type { AirportsService } from "./services/airports/contracts";
export type { CitiesService } from "./services/cities/contracts";
export type { CountriesService } from "./services/countries/contracts";
export type { PassengersService } from "./services/passengers/contracts";
export type { TiersService } from "./services/tiers/contracts";
export type { BidStatesService } from "./services/bidStates/contracts";
export type { FlightStatusesService } from "./services/flightStatuses/contracts";
export type { FlightHaulsService } from "./services/flightHauls/contracts";

export type EntityTable = {
  name: string;
  title: LocalizedString;
  rows: DbRow[];
};

export type EntitiesService = {
  listAll: () => Promise<EntityTable[]>;
};

export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
  passengers: PassengersService;
  tiers: TiersService;
  bidStates: BidStatesService;
  flightStatuses: FlightStatusesService;
  flightHauls: FlightHaulsService;
  entities: EntitiesService;
};
