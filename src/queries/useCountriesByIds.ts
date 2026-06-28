import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../backend/client";
import type { Country } from "../types";
import { queryKeys } from "./keys";

export const useCountriesByIds = (ids: Country["id"][]) =>
  useQuery({
    queryKey: queryKeys.countriesByIds(ids),
    queryFn: () => adminBackend.countries.findByIds(ids),
    enabled: ids.length > 0,
  });
