import type { Passenger } from "../../../types";

export type PassengersService = {
  getCurrent: () => Promise<Passenger | undefined>;
};
