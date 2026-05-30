import { FLIGHTS_DATA } from "../data";
import { INITIAL_BIDS, weighted } from "../data";
import type { Bid, Flight } from "../types";
import type { BackendClient } from "./contracts";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

function cloneBids(bids: Bid[]): Bid[] {
  return bids.map((bid) => ({ ...bid }));
}

function createInitialBidsByFlightId(flights: Flight[]): Map<Flight["id"], Bid[]> {
  const entries = flights.map((flight) => [flight.id, cloneBids(INITIAL_BIDS)] as const);
  return new Map(entries);
}

export const createMockBackendClient = (): BackendClient => {
  const bidsByFlightId = createInitialBidsByFlightId(FLIGHTS_DATA);

  const getMutableBids = (flightId: Flight["id"]): Bid[] => {
    const existing = bidsByFlightId.get(flightId);
    if (existing) return existing;
    const seeded = cloneBids(INITIAL_BIDS);
    bidsByFlightId.set(flightId, seeded);
    return seeded;
  };

  const baseClient: BackendClient = {
    flights: {
      async listFlights() {
        // Return a cloned array to avoid accidental in-place mutation by consumers.
        return [...FLIGHTS_DATA];
      },

      async getFlightById(flightId) {
        return FLIGHTS_DATA.find((flight) => flight.id === flightId);
      },
    },
    bids: {
      async listBids(flightId) {
        return cloneBids(getMutableBids(flightId));
      },

      async approveBid(flightId, bidId) {
        const mutable = getMutableBids(flightId);
        const found = mutable.find((bid) => bid.id === bidId);
        if (!found) return undefined;
        found.state = "approved";
        return { ...found };
      },

      async rejectBid(flightId, bidId) {
        const mutable = getMutableBids(flightId);
        const found = mutable.find((bid) => bid.id === bidId);
        if (!found) return undefined;
        found.state = "rejected";
        return { ...found };
      },

      async autoSelect(flightId) {
        const mutable = getMutableBids(flightId);
        const flight = FLIGHTS_DATA.find((item) => item.id === flightId);
        const availableSeats = flight?.bcFree ?? 0;

        const winners = [...mutable]
          .filter((bid) => bid.state === "pending")
          .sort((a, b) => weighted(b) - weighted(a))
          .slice(0, availableSeats)
          .map((bid) => bid.id);

        for (const bid of mutable) {
          if (winners.includes(bid.id)) {
            bid.state = "approved";
          }
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
