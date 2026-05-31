import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useCurrentPassenger = () =>
  useQuery({
    queryKey: queryKeys.currentPassenger,
    queryFn: () => backendClient.passengers.getCurrent(),
  });
