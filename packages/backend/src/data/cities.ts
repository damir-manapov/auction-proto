import type { City } from "@auction/core";

export const CITIES_DATA: City[] = [
  {
    id: "tashkent",
    name: { en: "Tashkent", ru: "Ташкент" },
    countryId: "uz",
    timezone: "Asia/Tashkent",
  },
  {
    id: "istanbul",
    name: { en: "Istanbul", ru: "Стамбул" },
    countryId: "tr",
    timezone: "Europe/Istanbul",
  },
  { id: "dubai", name: { en: "Dubai", ru: "Дубай" }, countryId: "ae", timezone: "Asia/Dubai" },
  {
    id: "moscow",
    name: { en: "Moscow", ru: "Москва" },
    countryId: "ru",
    timezone: "Europe/Moscow",
  },
  {
    id: "frankfurt",
    name: { en: "Frankfurt", ru: "Франкфурт" },
    countryId: "de",
    timezone: "Europe/Berlin",
  },
  {
    id: "beijing",
    name: { en: "Beijing", ru: "Пекин" },
    countryId: "cn",
    timezone: "Asia/Shanghai",
  },
  { id: "seoul", name: { en: "Seoul", ru: "Сеул" }, countryId: "kr", timezone: "Asia/Seoul" },
  {
    id: "london",
    name: { en: "London", ru: "Лондон" },
    countryId: "gb",
    timezone: "Europe/London",
  },
  {
    id: "almaty",
    name: { en: "Almaty", ru: "Алматы" },
    countryId: "kz",
    timezone: "Asia/Almaty",
  },
];
