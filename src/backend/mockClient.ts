import { FLIGHTS_DATA } from "../data";
import type { BackendClient } from "./contracts";

const DEFAULT_MOCK_LATENCY_MIN_MS = 120;
const DEFAULT_MOCK_LATENCY_MAX_MS = 800;

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function getMockLatencyRange() {
  // Keep tests deterministic and fast unless explicitly overridden.
  if (import.meta.env.MODE === "test") {
    return { minMs: 0, maxMs: 0 };
  }

  const envEnabled = import.meta.env.VITE_MOCK_LATENCY_ENABLED;
  const enabled = envEnabled ? envEnabled.toLowerCase() !== "false" : true;
  if (!enabled) {
    return { minMs: 0, maxMs: 0 };
  }

  const minFromEnv = toNumber(import.meta.env.VITE_MOCK_LATENCY_MIN_MS);
  const maxFromEnv = toNumber(import.meta.env.VITE_MOCK_LATENCY_MAX_MS);

  const minMs = Math.max(0, minFromEnv ?? DEFAULT_MOCK_LATENCY_MIN_MS);
  const maxCandidate = maxFromEnv ?? DEFAULT_MOCK_LATENCY_MAX_MS;
  const maxMs = Math.max(minMs, maxCandidate);

  return { minMs, maxMs };
}

async function mockSleep() {
  const { minMs, maxMs } = getMockLatencyRange();
  if (maxMs <= 0) return;
  const delayMs = Math.round(minMs + Math.random() * (maxMs - minMs));
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export const createMockBackendClient = (): BackendClient => ({
  flights: {
    async listFlights() {
      await mockSleep();
      // Return a cloned array to avoid accidental in-place mutation by consumers.
      return [...FLIGHTS_DATA];
    },

    async getFlightById(flightId) {
      await mockSleep();
      return FLIGHTS_DATA.find((flight) => flight.id === flightId);
    },
  },
});
