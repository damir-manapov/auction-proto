import { FLIGHTS_DATA, INITIAL_BIDS } from "../data";
import type { Bid, Flight } from "../types";
import type { FlightQuery, FlightsSummary } from "./contracts";
import { createDbEmulator, type DbFilter, type DbQuery, type DbQueryResult } from "./db/emulator";

export type BidRow = Bid & { flightId: Flight["id"] };

export function summarizeFlights(flights: Flight[]): FlightsSummary {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

function cloneBids(bids: Bid[]): Bid[] {
  return bids.map((bid) => ({ ...bid }));
}

export function seedDb() {
  const bidRows: BidRow[] = FLIGHTS_DATA.flatMap((flight) =>
    cloneBids(INITIAL_BIDS).map((bid) => ({ ...bid, flightId: flight.id })),
  );

  return createDbEmulator({
    flights: FLIGHTS_DATA,
    bids: bidRows,
  });
}

export function toDbFilters(query: FlightQuery): DbFilter[] | undefined {
  return query.filters?.map((filter) => ({
    field: String(filter.field),
    op: filter.op,
    value: filter.value,
  }));
}

export function toFlightQueryParams(query: FlightQuery, filters: DbFilter[] | undefined): DbQuery {
  return {
    searchFields: ["id", "from", "to", "aircraft"],
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
    ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
    ...(query.page !== undefined ? { page: query.page } : {}),
    ...(query.pageSize !== undefined ? { pageSize: query.pageSize } : {}),
  };
}

export function toFlightSummaryQueryParams(
  query: FlightQuery,
  filters: DbFilter[] | undefined,
): Omit<DbQuery, "page" | "pageSize"> {
  return {
    searchFields: ["id", "from", "to", "aircraft"],
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
    ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
  };
}

export function toFlightsPage(
  result: DbQueryResult<Flight>,
  filteredForSummary: Flight[],
): {
  items: Flight[];
  total: number;
  page: number;
  pageSize: number;
  summary: FlightsSummary;
} {
  return {
    items: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    summary: summarizeFlights(filteredForSummary),
  };
}

export function bidRowsToBids(rows: BidRow[]): Bid[] {
  return rows.map(({ flightId: _flightId, ...bid }) => bid);
}
