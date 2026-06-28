import { createBackend } from "./serviceClient";

// Composition root for data access; swap these with real API-backed clients incrementally.
const backend = createBackend();

/** Admin app surface: full flight operations, bid moderation, rules and entity tables. */
export const adminBackend = backend.admin;

/** Passenger app surface: bid config, seat map and narrowed delegated reads. */
export const passengerBackend = backend.passenger;
