import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { BidStateRow } from "../types";
import { queryKeys } from "./keys";

export const useBidStates = () =>
  useQuery({
    queryKey: queryKeys.bidStates,
    queryFn: () => backendClient.bidStates.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useBidStatesById = () => {
  const q = useBidStates();
  const byId: Partial<Record<BidStateRow["id"], BidStateRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};
