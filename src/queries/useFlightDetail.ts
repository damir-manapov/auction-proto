import { useQuery } from "@tanstack/react-query";
import type { Flight } from "../types";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightDetail = (flightId: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightDetail(flightId),
    queryFn: () => backendClient.flights.findDetailById(flightId),
  });
