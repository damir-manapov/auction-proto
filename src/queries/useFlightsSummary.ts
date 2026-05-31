import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightsSummary = () =>
  useQuery({
    queryKey: queryKeys.flightsSummary,
    queryFn: () => backendClient.flights.getSummary(),
  });
