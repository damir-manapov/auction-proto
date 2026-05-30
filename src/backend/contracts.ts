import type { Bid, Flight } from "../types";

export type FlightsService = {
  listFlights: () => Promise<Flight[]>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsService = {
  listBids: (flightId: Flight["id"]) => Promise<Bid[]>;
  approveBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  rejectBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};

export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
};
