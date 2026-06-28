import type { AirportsService } from "../services/airports/contracts";
import type { CitiesService } from "../services/cities/contracts";
import type { CountriesService } from "../services/countries/contracts";
import type { FlightHaulsService } from "../services/flightHauls/contracts";
import type { FlightsService } from "../services/flights/contracts";
import type { PassengerConfigService } from "../services/passengerConfig/contracts";
import type { PassengersService } from "../services/passengers/contracts";
import type { RulesService } from "../services/rules/contracts";
import type { SeatMapService } from "../services/seatMap/contracts";
import type { TiersService } from "../services/tiers/contracts";

/** Passengers may only read a single flight's detail, never the admin listing/query surface. */
export type PassengerFlightsService = Pick<FlightsService, "findDetailById">;

/** Passengers may read the active rules but never mutate them. */
export type PassengerRulesService = Pick<RulesService, "get">;

/**
 * Passenger backend surface: a read-mostly facade tailored to the passenger app.
 * It owns passenger-specific services (bid config, seat map) and otherwise delegates
 * to the admin backend for shared reads, exposing only a narrowed, safe subset.
 */
export type PassengerBackendClient = {
  passengerConfig: PassengerConfigService;
  seatMap: SeatMapService;
  passengers: PassengersService;
  flights: PassengerFlightsService;
  rules: PassengerRulesService;
  tiers: TiersService;
  flightHauls: FlightHaulsService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
};
