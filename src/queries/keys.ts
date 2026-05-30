export const queryKeys = {
  flights: ["flights"] as const,
  flightById: (flightId: string) => ["flight", flightId] as const,
};
