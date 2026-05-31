import { PASSENGERS_DATA } from "../../../data";
import type { Passenger } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { PassengersService } from "./contracts";

export const passengersSeed: EntitySeed = {
  passengers: PASSENGERS_DATA,
};

export function createPassengersService(db: DbEmulator): PassengersService {
  return {
    async getCurrent() {
      return db.findOne<Passenger>("passengers", [{ field: "id", op: "eq", value: "current" }]);
    },
  };
}
