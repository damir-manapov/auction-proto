export const queryKeys = {
  flights: ["flights"] as const,
  flightsSummary: ["flights-summary"] as const,
  flightsQuery: (params: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    pageSize?: number;
  }) => ["flights-query", params] as const,
  flightById: (flightId: string) => ["flight", flightId] as const,
  flightBids: (flightId: string) => ["flight-bids", flightId] as const,
};
