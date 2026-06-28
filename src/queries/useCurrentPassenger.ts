import { useQuery } from "@tanstack/react-query";
import { passengerBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useCurrentPassenger = () =>
  useQuery({
    queryKey: queryKeys.currentPassenger,
    queryFn: () => passengerBackend.passengers.getCurrent(),
  });
