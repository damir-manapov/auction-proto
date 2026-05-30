import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlights = () =>
  useQuery({
    queryKey: queryKeys.flights,
    queryFn: () => backendClient.flights.listFlights(),
  });
