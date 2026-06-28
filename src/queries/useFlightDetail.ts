import { useQuery } from "@tanstack/react-query";
import type { Flight } from "../types";
import { adminBackend, passengerBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightDetail = (flightId?: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightDetail(flightId ?? "__pending__"),
    queryFn: () => adminBackend.flights.findDetailById(flightId as Flight["id"]),
    enabled: Boolean(flightId),
  });

export const usePassengerFlightDetail = (flightId?: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightDetail(flightId ?? "__pending__"),
    queryFn: () => passengerBackend.flights.findDetailById(flightId as Flight["id"]),
    enabled: Boolean(flightId),
  });
