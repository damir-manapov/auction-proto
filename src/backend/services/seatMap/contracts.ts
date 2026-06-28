import type { Flight, SeatMapLayout } from "../../../types";

export type SeatMapService = {
  getBusinessClass: (flightId: Flight["id"]) => Promise<SeatMapLayout>;
};
