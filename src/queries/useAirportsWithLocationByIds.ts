import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { Airport } from "../types";
import { queryKeys } from "./keys";

export const useAirportsWithLocationByIds = (ids: Airport["id"][]) =>
  useQuery({
    queryKey: queryKeys.airportsWithLocationByIds(ids),
    queryFn: () => backendClient.airports.findWithLocationByIds(ids),
    enabled: ids.length > 0,
  });
