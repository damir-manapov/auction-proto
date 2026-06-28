import { FLIGHT_HAULS_DATA } from "../../../data/flightHauls";
import type { FlightHaulRow, LocalizedString } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { FlightHaulsService } from "./contracts";

export const flightHaulsSeed: EntitySeed = {
  flightHauls: FLIGHT_HAULS_DATA,
};

export const flightHaulsTitle: LocalizedString = {
  en: "Flight Hauls",
  ru: "Типы перелётов",
  uz: "Parvoz turlari",
};

export function createFlightHaulsService(db: DbEmulator): FlightHaulsService {
  return {
    async list() {
      return db.list<FlightHaulRow>("flightHauls");
    },
  };
}
