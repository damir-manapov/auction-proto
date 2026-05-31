import type { FlightHaulRow } from "../../../types";

export type FlightHaulsService = {
  list: () => Promise<FlightHaulRow[]>;
};
