import type { Airport, Bid, City, Country, Flight } from "../types";
import type { FlightListSortCol, SortDir } from "../types";
import type { DbRow } from "./db/emulator";

export type FlightFilter = {
  field: keyof Flight;
  op: "eq" | "contains" | "in";
  value: string | number | Array<string | number>;
};

export type FlightQuery = {
  search?: string;
  filters?: FlightFilter[];
  sortBy?: FlightListSortCol;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
};

export type FlightsSummary = {
  active: number;
  bids: number;
  revenue: number;
  freeSeats: number;
};

export type FlightsPage = {
  items: Flight[];
  total: number;
  page: number;
  pageSize: number;
  summary: FlightsSummary;
};

export type FlightsService = {
  list: () => Promise<Flight[]>;
  query: (query: FlightQuery) => Promise<FlightsPage>;
  getSummary: () => Promise<FlightsSummary>;
  findById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsService = {
  list: (flightId: Flight["id"]) => Promise<Bid[]>;
  approve: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  reject: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};

export type AirportsService = {
  list: () => Promise<Airport[]>;
  findByIds: (ids: Airport["id"][]) => Promise<Airport[]>;
};

export type CitiesService = {
  list: () => Promise<City[]>;
  findByIds: (ids: City["id"][]) => Promise<City[]>;
};

export type CountriesService = {
  list: () => Promise<Country[]>;
  findByIds: (ids: Country["id"][]) => Promise<Country[]>;
};

export type EntityTable = {
  name: string;
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
  entities: EntitiesService;
};
