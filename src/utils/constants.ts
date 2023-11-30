import { HOST_API } from "@env";
import type { WeekDay } from "../types/WeekDay";

export const API_BASE_URL = __DEV__
  ? HOST_API
  : "https://api-inquadra-uat.qodeless.com.br";

export const SERVICE_FEE = 0.04;

export enum AsyncStorageKeys {
  CourtPriceHourAllAppointments = "@inquadra/court-price-hour_all-appointments",
  CourtPriceHourDayUse = "@inquadra/court-price-hour_day-use",
}

export const indexToWeekDayMap: Record<number, WeekDay> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "SpecialDays",
};

export const weekDayToIndexMap: Record<WeekDay, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  SpecialDays: 7,
};
