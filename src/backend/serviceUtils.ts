import type { Bid, Flight } from "../types";
import type { FlightQuery } from "./contracts";
import type { DbFilter, DbQuery, DbRow } from "./db/emulator";

export type BidRow = Bid & { flightId: Flight["id"] };

export type EntitySeed = Record<string, DbRow[]>;

export function toDbFilters(query: FlightQuery): DbFilter[] | undefined {
  return query.filters?.map((filter) => ({
    field: String(filter.field),
    op: filter.op,
    value: filter.value,
  }));
}

export function toFlightQueryParams(query: FlightQuery, filters: DbFilter[] | undefined): DbQuery {
  return {
    searchFields: ["id", "fromAirportId", "toAirportId", "aircraft"],
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
    searchFields: ["id", "fromAirportId", "toAirportId", "aircraft"],
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
    ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
  };
}

export function bidRowsToBids(rows: BidRow[]): Bid[] {
  return rows.map(({ flightId: _flightId, ...bid }) => bid);
}

export function toBidRowFilters(flightId: Flight["id"], bidId?: Bid["id"]): DbFilter[] {
  const filters: DbFilter[] = [{ field: "flightId", op: "eq", value: flightId }];
  if (bidId !== undefined) {
    filters.push({ field: "id", op: "eq", value: bidId });
  }
  return filters;
}
