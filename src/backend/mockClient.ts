import { FLIGHTS_DATA } from "../data";
import type { BackendClient } from "./contracts";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

export const createMockBackendClient = (): BackendClient => {
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
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
