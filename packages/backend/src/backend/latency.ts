type LatencyRange = {
  minMs: number;
  maxMs: number;
};

type MockFailureConfig = {
  enabled: boolean;
  rate: number;
};

export type DecoratorCallContext = {
  path: string[];
};

type BeforeCall = (ctx: DecoratorCallContext) => Promise<void> | void;

const DEFAULT_MOCK_LATENCY_MIN_MS = 20;
const DEFAULT_MOCK_LATENCY_MAX_MS = 400;
const DEFAULT_MOCK_FAILURE_RATE = 0;

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function toBoolean(value: string | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return null;
}

function readEnv(key: string): string | undefined {
  const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
  const fromVite = meta.env?.[key];
  if (fromVite !== undefined) return fromVite;
  if (typeof process !== "undefined") return process.env[key];
  return undefined;
}

function readMode(): string {
  return readEnv("MODE") ?? readEnv("NODE_ENV") ?? "development";
}

export function getMockLatencyRange(): LatencyRange {
  // Keep tests deterministic and fast unless explicitly overridden.
  if (readMode() === "test") {
    return { minMs: 0, maxMs: 0 };
  }

  const envEnabled = readEnv("VITE_MOCK_LATENCY_ENABLED");
  const enabled = envEnabled ? envEnabled.toLowerCase() !== "false" : true;
  if (!enabled) {
    return { minMs: 0, maxMs: 0 };
  }

  const minFromEnv = toNumber(readEnv("VITE_MOCK_LATENCY_MIN_MS"));
  const maxFromEnv = toNumber(readEnv("VITE_MOCK_LATENCY_MAX_MS"));

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

export function getMockFailureConfig(): MockFailureConfig {
  if (readMode() === "test") {
    return { enabled: false, rate: 0 };
  }

  const enabledFromEnv = toBoolean(readEnv("VITE_MOCK_FAILURE_ENABLED"));
  const enabled = enabledFromEnv ?? true;

  const rateFromEnv = toNumber(readEnv("VITE_MOCK_FAILURE_RATE"));
  const rate = Math.min(1, Math.max(0, rateFromEnv ?? DEFAULT_MOCK_FAILURE_RATE));

  return {
    enabled,
    rate,
  };
}

export function createMockFailureInjector(
  getConfig: () => MockFailureConfig = getMockFailureConfig,
): BeforeCall {
  return ({ path }) => {
    const config = getConfig();
    if (!config.enabled) return;

    const endpoint = path.join(".");
    if (config.rate > 0 && Math.random() < config.rate) {
      throw new Error(`Mock backend failure at ${endpoint}`);
    }
  };
}

export function composeBeforeCall(...hooks: BeforeCall[]): BeforeCall {
  return async (ctx) => {
    for (const hook of hooks) {
      await hook(ctx);
    }
  };
}

type AsyncFn<TArgs extends unknown[] = unknown[], TResult = unknown> = (
  ...args: TArgs
) => Promise<TResult>;

type AnyObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is AnyObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function withAsyncLatency<TArgs extends unknown[], TResult>(
  fn: AsyncFn<TArgs, TResult>,
  beforeCall: BeforeCall,
  path: string[],
): AsyncFn<TArgs, TResult> {
  return async (...args: TArgs) => {
    await beforeCall({ path });
    return fn(...args);
  };
}

export function withLatency<TTarget extends AnyObject>(
  target: TTarget,
  beforeCall: BeforeCall,
  path: string[] = [],
): TTarget {
  const wrappedEntries = Object.entries(target).map(([key, value]) => {
    const nextPath = [...path, key];
    if (typeof value === "function") {
      return [key, withAsyncLatency(value as AsyncFn, beforeCall, nextPath)];
    }
    if (isPlainObject(value)) {
      return [key, withLatency(value, beforeCall, nextPath)];
    }
    return [key, value];
  });

  return Object.fromEntries(wrappedEntries) as TTarget;
}
