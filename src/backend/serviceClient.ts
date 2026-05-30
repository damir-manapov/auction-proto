import { weighted } from "../data";
import type { Bid, BidState, Flight } from "../types";
import type { BackendClient } from "./contracts";
import {
  bidRowsToBids,
  seedDb,
  toDbFilters,
  toBidRowFilters,
  toFlightQueryParams,
  toFlightSummaryQueryParams,
  type BidRow,
} from "./serviceUtils";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

function summarizeFlights(flights: Flight[]) {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

function toFlightsPage(
  result: { items: Flight[]; total: number; page: number; pageSize: number },
  filteredForSummary: Flight[],
) {
  return {
    items: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    summary: summarizeFlights(filteredForSummary),
  };
}

function selectWinningBidIds(rows: Bid[], availableSeats: number): Bid["id"][] {
  return [...rows]
    .filter((bid) => bid.state === "pending")
    .sort((a, b) => weighted(b) - weighted(a))
    .slice(0, availableSeats)
    .map((bid) => bid.id);
}

export const createServiceClient = (): BackendClient => {
  const db = seedDb();

  const baseClient: BackendClient = {
    flights: {
      async listFlights() {
        return db.list<Flight>("flights");
      },

      async queryFlights(query) {
        const mappedFilters = toDbFilters(query);
        const queryParams = toFlightQueryParams(query, mappedFilters);
        const result = db.query<Flight>("flights", queryParams);
        const filteredForSummary = db.queryAll<Flight>(
          "flights",
          toFlightSummaryQueryParams(query, mappedFilters),
        );
        return toFlightsPage(result, filteredForSummary);
      },

      async getFlightsSummary() {
        const allFlights = db.list<Flight>("flights");
        return summarizeFlights(allFlights);
      },

      async getFlightById(flightId) {
        return db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
      },
    },
    bids: {
      async listBids(flightId) {
        const all = db.queryAll<BidRow>("bids", {
          filters: [{ field: "flightId", op: "eq", value: flightId }],
        });
        return bidRowsToBids(all);
      },

      async approveBid(flightId, bidId) {
        const updated = db.updateOne<BidRow>("bids", toBidRowFilters(flightId, bidId), {
          state: "approved",
        });
        if (!updated) return undefined;
        return bidRowsToBids([updated])[0];
      },

      async rejectBid(flightId, bidId) {
        const updated = db.updateOne<BidRow>("bids", toBidRowFilters(flightId, bidId), {
          state: "rejected",
        });
        if (!updated) return undefined;
        return bidRowsToBids([updated])[0];
      },

      async autoSelect(flightId) {
        const mutable = bidRowsToBids(
          db.queryAll<BidRow>("bids", {
            filters: [{ field: "flightId", op: "eq", value: flightId }],
          }),
        );

        const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
        const availableSeats = flight?.bcFree ?? 0;

        const winners = selectWinningBidIds(mutable, availableSeats);

        if (winners.length > 0) {
          db.updateMany<BidRow>(
            "bids",
            [
              { field: "flightId", op: "eq", value: flightId },
              { field: "id", op: "in", value: winners },
            ],
            { state: "approved" as BidState },
          );
        }

        return winners;
      },
    },
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
