import type { Bid, BidState, Flight } from "../../types";
import type { FlightQuery, FlightsPage, FlightsSummary } from "../contracts";

export type FlightsDb = {
  listFlights: () => Promise<Flight[]>;
  queryFlights: (query: FlightQuery) => Promise<FlightsPage>;
  getFlightsSummary: () => Promise<FlightsSummary>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsDb = {
  listBids: (flightId: Flight["id"]) => Promise<Bid[]>;
  setBidState: (
    flightId: Flight["id"],
    bidId: Bid["id"],
    state: BidState,
  ) => Promise<Bid | undefined>;
  setManyBidStates: (flightId: Flight["id"], bidIds: Bid["id"][], state: BidState) => Promise<void>;
};

export type AppDb = {
  flights: FlightsDb;
  bids: BidsDb;
};
