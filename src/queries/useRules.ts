import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../backend/client";
import { queryKeys } from "./keys";

export const useRules = () =>
  useQuery({
    queryKey: queryKeys.rules,
    queryFn: () => adminBackend.rules.get(),
  });
