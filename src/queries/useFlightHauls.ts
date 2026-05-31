import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { FlightHaulRow } from "../types";
import { queryKeys } from "./keys";

export const useFlightHauls = () =>
  useQuery({
    queryKey: queryKeys.flightHauls,
    queryFn: () => backendClient.flightHauls.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useFlightHaulsById = () => {
  const q = useFlightHauls();
  const byId: Partial<Record<FlightHaulRow["id"], FlightHaulRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};
