import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useRules = () =>
  useQuery({
    queryKey: queryKeys.rules,
    queryFn: () => backendClient.rules.get(),
  });
