import { useQuery } from "@tanstack/react-query";
import type { Flight } from "../types";
import { adminBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightById = (flightId: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightById(flightId),
    queryFn: () => adminBackend.flights.findById(flightId),
  });
