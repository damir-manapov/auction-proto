import { useQuery } from "@tanstack/react-query";
import type { Flight } from "../types";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightBids = (flightId: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightBids(flightId),
    queryFn: () => backendClient.bids.listBids(flightId),
  });
