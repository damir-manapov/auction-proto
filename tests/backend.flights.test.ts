import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend flights service", () => {
  it("returns seeded flights and summary data", async () => {
    const client = createServiceClient();

    const allFlights = await client.flights.list();
    const summary = await client.flights.getSummary();

    expect(allFlights).toHaveLength(8);
    expect(summary).toEqual({
      active: 5,
      bids: 35,
      revenue: 23840,
      freeSeats: 47,
    });
  });

  it("queries flights with filters and summary shaping", async () => {
    const client = createServiceClient();

    const page = await client.flights.query({
      search: "TAS",
      filters: [{ field: "status", op: "eq", value: "active" }],
      sortBy: "revenue",
      sortDir: "desc",
      page: 1,
      pageSize: 2,
    });

    expect(page.total).toBe(5);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(2);
    expect(page.items.map((flight) => flight.id)).toEqual(["HY 814", "HY 409"]);
    expect(page.summary).toEqual({
      active: 5,
      bids: 26,
      revenue: 10140,
      freeSeats: 23,
    });
  });

  it("looks up a flight by id", async () => {
    const client = createServiceClient();

    const flight = await client.flights.findById("HY 602");
    expect(flight?.fromAirportId).toBe("TAS");
  });

  it("returns undefined for missing flights", async () => {
    const client = createServiceClient();

    await expect(client.flights.findById("HY 999")).resolves.toBeUndefined();
  });

  it("loads flight detail with route airports in a single call", async () => {
    const client = createServiceClient();

    const detail = await client.flights.findDetailById("HY 602");
    expect(detail?.fromAirport.id).toBe("TAS");
    expect(detail?.toAirport.id).toBe(detail?.toAirportId);
    expect(detail?.fromAirport.city.timezone.length).toBeGreaterThan(0);
    expect(detail?.fromAirport.country.id.length).toBeGreaterThan(0);

    await expect(client.flights.findDetailById("HY 999")).resolves.toBeUndefined();
  });
});
