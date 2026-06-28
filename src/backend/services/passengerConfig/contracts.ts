import type { PassengerConfig } from "../../../types";

export type PassengerConfigService = {
  get: () => Promise<PassengerConfig>;
};
