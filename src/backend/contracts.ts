import type { Airport, Bid, Flight } from "../types";
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
  listFlights: () => Promise<Flight[]>;
  queryFlights: (query: FlightQuery) => Promise<FlightsPage>;
  getFlightsSummary: () => Promise<FlightsSummary>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsService = {
  listBids: (flightId: Flight["id"]) => Promise<Bid[]>;
  approveBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  rejectBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};

export type AirportsService = {
  listAirports: () => Promise<Airport[]>;
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
  entities: EntitiesService;
};
