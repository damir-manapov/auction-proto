import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightsSummary = () =>
  useQuery({
    queryKey: queryKeys.flightsSummary,
    queryFn: () => adminBackend.flights.getSummary(),
  });
