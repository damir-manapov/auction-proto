import type { Airport, AirportWithLocation, City, Country } from "../../../types";
import type { DbEmulator } from "../../db/contracts";

function joinWithLocation(
  airports: Airport[],
  cities: City[],
  countries: Country[],
): AirportWithLocation[] {
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const countryById = new Map(countries.map((country) => [country.id, country]));
  return airports.flatMap((airport) => {
    const city = cityById.get(airport.cityId);
    if (!city) return [];
    const country = countryById.get(city.countryId);
    if (!country) return [];
    return [{ ...airport, city, country }];
  });
}

export function loadAirportsWithLocation(
  db: DbEmulator,
  airports: Airport[],
): AirportWithLocation[] {
  if (airports.length === 0) return [];
  const cityIds = Array.from(new Set(airports.map((a) => a.cityId)));
  const cities = db.queryAll<City>("cities", {
    filters: [{ field: "id", op: "in", value: cityIds }],
  });
  const countryIds = Array.from(new Set(cities.map((c) => c.countryId)));
  const countries = db.queryAll<Country>("countries", {
    filters: [{ field: "id", op: "in", value: countryIds }],
  });
  return joinWithLocation(airports, cities, countries);
}

export function findAirportsWithLocationByIds(
  db: DbEmulator,
  ids: Airport["id"][],
): AirportWithLocation[] {
  if (ids.length === 0) return [];
  const airports = db.queryAll<Airport>("airports", {
    filters: [{ field: "id", op: "in", value: ids }],
  });
  return loadAirportsWithLocation(db, airports);
}
