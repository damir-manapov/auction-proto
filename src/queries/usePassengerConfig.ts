import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const usePassengerConfig = () =>
  useQuery({
    queryKey: queryKeys.passengerConfig,
    queryFn: () => backendClient.passengerConfig.get(),
  });
