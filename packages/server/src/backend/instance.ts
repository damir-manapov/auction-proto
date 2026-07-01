import { createBackend } from "@auction/backend";

/**
 * Single mocked backend instance shared by all controllers. The data store is
 * the in-memory emulator from `@auction/backend`; swap `createBackend()` for a
 * real data-access client when persistence is introduced.
 */
export const backend = createBackend();

export function parseIds(ids: string | undefined): string[] {
  if (!ids) return [];
  return ids
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
