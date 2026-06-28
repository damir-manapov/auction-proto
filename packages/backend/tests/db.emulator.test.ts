import { describe, expect, it } from "vitest";
import { createDbEmulator } from "../src/backend/db/emulator";

describe("db emulator", () => {
  it("returns cloned rows from list", () => {
    const db = createDbEmulator({
      flights: [{ id: "HY 001", status: "active", bids: 2 }],
    });

    const rows = db.list<{ id: string; status: string; bids: number }>("flights");
    const firstRow = rows[0];
    if (!firstRow) throw new Error("Expected seeded flight row");
    firstRow.status = "sold";

    const fresh = db.list<{ id: string; status: string; bids: number }>("flights");
    const freshRow = fresh[0];
    if (!freshRow) throw new Error("Expected persisted flight row");
    expect(freshRow.status).toBe("active");
  });

  it("supports query with search, filters, sorting, and paging", () => {
    const db = createDbEmulator({
      flights: [
        { id: "HY 100", from: "TAS", to: "IST", revenue: 1000, status: "active" },
        { id: "HY 200", from: "TAS", to: "DXB", revenue: 3000, status: "active" },
        { id: "HY 300", from: "TAS", to: "FRA", revenue: 2000, status: "sold" },
      ],
    });

    const result = db.query<{
      id: string;
      from: string;
      to: string;
      revenue: number;
      status: string;
    }>("flights", {
      search: "tas",
      searchFields: ["from", "to"],
      filters: [{ field: "status", op: "eq", value: "active" }],
      sortBy: "revenue",
      sortDir: "desc",
      page: 1,
      pageSize: 1,
    });

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(1);
    const firstItem = result.items[0];
    if (!firstItem) throw new Error("Expected first page result");
    expect(firstItem.id).toBe("HY 200");
  });

  it("findOne matches row by declarative filters", () => {
    const db = createDbEmulator({
      bids: [
        { id: 1, flightId: "HY 100", state: "pending" },
        { id: 2, flightId: "HY 100", state: "approved" },
      ],
    });

    const found = db.findOne<{ id: number; flightId: string; state: string }>("bids", [
      { field: "flightId", op: "eq", value: "HY 100" },
      { field: "state", op: "eq", value: "approved" },
    ]);

    expect(found?.id).toBe(2);
  });

  it("updateOne patches exactly one matching row", () => {
    const db = createDbEmulator({
      bids: [
        { id: 1, flightId: "HY 100", state: "pending" },
        { id: 2, flightId: "HY 100", state: "pending" },
      ],
    });

    const updated = db.updateOne<{ id: number; flightId: string; state: string }>(
      "bids",
      [
        { field: "flightId", op: "eq", value: "HY 100" },
        { field: "id", op: "eq", value: 2 },
      ],
      { state: "approved" },
    );

    const all = db.list<{ id: number; flightId: string; state: string }>("bids");
    expect(updated?.state).toBe("approved");
    expect(all.find((x) => x.id === 1)?.state).toBe("pending");
    expect(all.find((x) => x.id === 2)?.state).toBe("approved");
  });

  it("updateMany patches all rows that match an in filter", () => {
    const db = createDbEmulator({
      bids: [
        { id: 1, flightId: "HY 100", state: "pending" },
        { id: 2, flightId: "HY 100", state: "pending" },
        { id: 3, flightId: "HY 100", state: "pending" },
      ],
    });

    const updatedCount = db.updateMany<{ id: number; flightId: string; state: string }>(
      "bids",
      [
        { field: "flightId", op: "eq", value: "HY 100" },
        { field: "id", op: "in", value: [1, 3] },
      ],
      { state: "approved" },
    );

    const all = db.list<{ id: number; flightId: string; state: string }>("bids");
    expect(updatedCount).toBe(2);
    expect(all.find((x) => x.id === 1)?.state).toBe("approved");
    expect(all.find((x) => x.id === 2)?.state).toBe("pending");
    expect(all.find((x) => x.id === 3)?.state).toBe("approved");
  });

  it("returns undefined or zero for no-match find/update paths", () => {
    const db = createDbEmulator({
      bids: [{ id: 1, flightId: "HY 100", state: "pending" }],
    });

    const found = db.findOne<{ id: number; flightId: string; state: string }>("bids", [
      { field: "id", op: "eq", value: 999 },
    ]);

    const updatedOne = db.updateOne<{ id: number; flightId: string; state: string }>(
      "bids",
      [{ field: "id", op: "eq", value: 999 }],
      { state: "approved" },
    );

    const updatedMany = db.updateMany<{ id: number; flightId: string; state: string }>(
      "bids",
      [{ field: "id", op: "in", value: [999, 1000] }],
      { state: "approved" },
    );

    expect(found).toBeUndefined();
    expect(updatedOne).toBeUndefined();
    expect(updatedMany).toBe(0);
  });

  it("supports contains filter case-insensitively", () => {
    const db = createDbEmulator({
      flights: [
        { id: "HY 100", route: "Tashkent - Dubai" },
        { id: "HY 200", route: "Tashkent - Istanbul" },
      ],
    });

    const result = db.query<{ id: string; route: string }>("flights", {
      filters: [{ field: "route", op: "contains", value: "DUBAI" }],
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBe(1);
    expect(result.items[0]?.id).toBe("HY 100");
  });

  it("treats in filter with non-array value as no-match", () => {
    const db = createDbEmulator({
      bids: [{ id: 1, state: "pending" }],
    });

    const result = db.query<{ id: number; state: string }>("bids", {
      filters: [{ field: "id", op: "in", value: 1 }],
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it("applies query defaults and clamps page/pageSize to minimum 1", () => {
    const db = createDbEmulator({
      flights: [
        { id: "A", revenue: 10 },
        { id: "B", revenue: 20 },
      ],
    });

    const defaults = db.query<{ id: string; revenue: number }>("flights", {});
    expect(defaults.page).toBe(1);
    expect(defaults.pageSize).toBe(2);
    expect(defaults.total).toBe(2);

    const clamped = db.query<{ id: string; revenue: number }>("flights", {
      page: 0,
      pageSize: 0,
    });
    expect(clamped.page).toBe(1);
    expect(clamped.pageSize).toBe(1);
  });

  it("handles numeric and string sorting branches", () => {
    const db = createDbEmulator({
      rows: [
        { id: "B", score: 10 },
        { id: "A", score: 30 },
        { id: "C", score: 20 },
      ],
    });

    const byNumber = db.query<{ id: string; score: number }>("rows", {
      sortBy: "score",
      sortDir: "desc",
      page: 1,
      pageSize: 10,
    });
    expect(byNumber.items.map((x) => x.id)).toEqual(["A", "C", "B"]);

    const byString = db.query<{ id: string; score: number }>("rows", {
      sortBy: "id",
      sortDir: "asc",
      page: 1,
      pageSize: 10,
    });
    expect(byString.items.map((x) => x.id)).toEqual(["A", "B", "C"]);
  });

  it("returns no results when search is set but searchFields is empty", () => {
    const db = createDbEmulator({
      flights: [{ id: "HY 100", from: "TAS" }],
    });

    const result = db.query<{ id: string; from: string }>("flights", {
      search: "tas",
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBe(0);
  });

  it("queryAll ignores pagination by returning all matches", () => {
    const db = createDbEmulator({
      flights: [
        { id: "HY 100", status: "active" },
        { id: "HY 200", status: "active" },
        { id: "HY 300", status: "sold" },
      ],
    });

    const result = db.queryAll<{ id: string; status: string }>("flights", {
      filters: [{ field: "status", op: "eq", value: "active" }],
      sortBy: "id",
      sortDir: "asc",
    });

    expect(result.map((x) => x.id)).toEqual(["HY 100", "HY 200"]);
  });

  it("creates unknown tables lazily as empty", () => {
    const db = createDbEmulator({});

    const missingList = db.list<{ id: string }>("missing");
    const missingFind = db.findOne<{ id: string }>("missing", [
      { field: "id", op: "eq", value: "x" },
    ]);

    expect(missingList).toEqual([]);
    expect(missingFind).toBeUndefined();
  });

  it("returns cloned updated rows and applies shallow patch semantics", () => {
    const db = createDbEmulator({
      flights: [{ id: "HY 100", status: "active", meta: { gate: "A1" } }],
    });

    const updated = db.updateOne<{ id: string; status: string; meta: { gate: string } }>(
      "flights",
      [{ field: "id", op: "eq", value: "HY 100" }],
      { status: "sold" },
    );

    if (!updated) throw new Error("Expected updated row");
    updated.status = "mutated";

    const persisted = db.findOne<{ id: string; status: string; meta: { gate: string } }>(
      "flights",
      [{ field: "id", op: "eq", value: "HY 100" }],
    );

    expect(persisted?.status).toBe("sold");
    expect(persisted?.meta.gate).toBe("A1");
  });
});
