import { BASE_API_URL } from "@/api/index";

export const masterUpdateUrl = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/update`);

export const masterCheckTimetableAvailabilityUrl = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/check-timetable-availability`);

export const masterTimetableUrl = (masterId: number, date: string) =>
  BASE_API_URL.concat(`/master/${masterId}/timetable/${date}`);
