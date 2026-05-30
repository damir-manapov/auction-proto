import type { BackendClient } from "./contracts";

type LatencyRange = {
  minMs: number;
  maxMs: number;
};

const DEFAULT_MOCK_LATENCY_MIN_MS = 120;
const DEFAULT_MOCK_LATENCY_MAX_MS = 800;

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export function getMockLatencyRange(): LatencyRange {
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

export function createJitterSleeper(getRange: () => LatencyRange): () => Promise<void> {
  return async () => {
    const { minMs, maxMs } = getRange();
    if (maxMs <= 0) return;
    const delayMs = Math.round(minMs + Math.random() * (maxMs - minMs));
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  };
}

export function withBackendClientLatency(
  client: BackendClient,
  sleep: () => Promise<void>,
): BackendClient {
  return {
    flights: {
      async listFlights() {
        await sleep();
        return client.flights.listFlights();
      },

      async getFlightById(flightId) {
        await sleep();
        return client.flights.getFlightById(flightId);
      },
    },
  };
}
