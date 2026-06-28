import { useQuery } from "@tanstack/react-query";
import type { Flight } from "../types";
import { passengerBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useSeatMap = (flightId: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.seatMap(flightId),
    queryFn: () => passengerBackend.seatMap.getBusinessClass(flightId),
  });
