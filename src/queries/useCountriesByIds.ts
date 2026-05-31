import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import type { Country } from "../types";
import { queryKeys } from "./keys";

export const useCountriesByIds = (ids: Country["id"][]) =>
  useQuery({
    queryKey: queryKeys.countriesByIds(ids),
    queryFn: () => backendClient.countries.findCountriesByIds(ids),
    enabled: ids.length > 0,
  });
