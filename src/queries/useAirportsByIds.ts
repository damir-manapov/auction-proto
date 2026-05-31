import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { Airport } from "../types";
import { queryKeys } from "./keys";

export const useAirportsByIds = (ids: Airport["id"][]) =>
  useQuery({
    queryKey: queryKeys.airportsByIds(ids),
    queryFn: () => backendClient.airports.findByIds(ids),
    enabled: ids.length > 0,
  });
