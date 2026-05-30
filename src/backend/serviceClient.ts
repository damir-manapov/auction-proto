import { weighted } from "../data";
import type { BidState, Flight } from "../types";
import type { BackendClient } from "./contracts";
import {
  bidRowsToBids,
  seedDb,
  toDbFilters,
  toFlightsPage,
  toFlightQueryParams,
  toFlightSummaryQueryParams,
  type BidRow,
  summarizeFlights,
} from "./serviceUtils";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

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
        const all = db.list<BidRow>("bids");
        return bidRowsToBids(all.filter((bid) => bid.flightId === flightId));
      },

      async approveBid(flightId, bidId) {
        const updated = db.updateOne<BidRow>(
          "bids",
          [
            { field: "flightId", op: "eq", value: flightId },
            { field: "id", op: "eq", value: bidId },
          ],
          { state: "approved" },
        );
        if (!updated) return undefined;
        return bidRowsToBids([updated])[0];
      },

      async rejectBid(flightId, bidId) {
        const updated = db.updateOne<BidRow>(
          "bids",
          [
            { field: "flightId", op: "eq", value: flightId },
            { field: "id", op: "eq", value: bidId },
          ],
          { state: "rejected" },
        );
        if (!updated) return undefined;
        return bidRowsToBids([updated])[0];
      },

      async autoSelect(flightId) {
        const all = db.list<BidRow>("bids");
        const mutable = bidRowsToBids(all.filter((bid) => bid.flightId === flightId));

        const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
        const availableSeats = flight?.bcFree ?? 0;

        const winners = [...mutable]
          .filter((bid) => bid.state === "pending")
          .sort((a, b) => weighted(b) - weighted(a))
          .slice(0, availableSeats)
          .map((bid) => bid.id);

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
