import type { FlightStatusRow } from "../../../types";

export type FlightStatusesService = {
  list: () => Promise<FlightStatusRow[]>;
};
