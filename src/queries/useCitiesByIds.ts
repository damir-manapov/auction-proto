import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { City } from "../types";
import { queryKeys } from "./keys";

export const useCitiesByIds = (ids: City["id"][]) =>
  useQuery({
    queryKey: queryKeys.citiesByIds(ids),
    queryFn: () => backendClient.cities.findByIds(ids),
    enabled: ids.length > 0,
  });
