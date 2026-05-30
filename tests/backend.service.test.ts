import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend service client", () => {
  it("returns seeded flights and summary data", async () => {
    const client = createServiceClient();

    const allFlights = await client.flights.listFlights();
    const summary = await client.flights.getFlightsSummary();

    expect(allFlights).toHaveLength(8);
    expect(summary).toEqual({
      active: 5,
      bids: 146,
      revenue: 23780,
      freeSeats: 47,
    });
  });

  it("queries flights with filters and summary shaping", async () => {
    const client = createServiceClient();

    const page = await client.flights.queryFlights({
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
      bids: 96,
      revenue: 10080,
      freeSeats: 23,
    });
  });

  it("supports flight lookup and bid mutations", async () => {
    const client = createServiceClient();

    const flight = await client.flights.getFlightById("HY 602");
    expect(flight?.from).toBe("TAS");

    const bids = await client.bids.listBids("HY 602");
    expect(bids).toHaveLength(10);

    const approved = await client.bids.approveBid("HY 602", 2);
    expect(approved?.state).toBe("approved");

    const rejected = await client.bids.rejectBid("HY 602", 3);
    expect(rejected?.state).toBe("rejected");

    const winners = await client.bids.autoSelect("HY 602");
    expect(winners).toEqual([1, 4]);

    const refreshed = await client.bids.listBids("HY 602");
    expect(refreshed.find((bid) => bid.id === 1)?.state).toBe("approved");
    expect(refreshed.find((bid) => bid.id === 4)?.state).toBe("approved");
    expect(refreshed.find((bid) => bid.id === 3)?.state).toBe("rejected");
  });
});
