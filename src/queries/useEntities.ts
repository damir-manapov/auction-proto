import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useEntities = () =>
  useQuery({
    queryKey: queryKeys.entities,
    queryFn: () => backendClient.entities.listAll(),
  });
