import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "@auction/backend";
import { queryKeys } from "./keys";

export const useFlightsSummary = () =>
  useQuery({
    queryKey: queryKeys.flightsSummary,
    queryFn: () => adminBackend.flights.getSummary(),
  });
