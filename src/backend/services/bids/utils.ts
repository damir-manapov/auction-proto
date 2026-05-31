import type { Bid, Flight } from "../../../types";
import type { DbFilter } from "../../db/contracts";

export function toBidFilters(flightId: Flight["id"], bidId?: Bid["id"]): DbFilter[] {
  const filters: DbFilter[] = [{ field: "flightId", op: "eq", value: flightId }];
  if (bidId !== undefined) {
    filters.push({ field: "id", op: "eq", value: bidId });
  }
  return filters;
}
