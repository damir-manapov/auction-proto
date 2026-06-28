import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "@auction/backend";
import { queryKeys } from "./keys";

export const useRules = () =>
  useQuery({
    queryKey: queryKeys.rules,
    queryFn: () => adminBackend.rules.get(),
  });
