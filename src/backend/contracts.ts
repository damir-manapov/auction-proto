import type { Flight } from "../types";

export type FlightsService = {
  listFlights: () => Promise<Flight[]>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BackendClient = {
  flights: FlightsService;
};
