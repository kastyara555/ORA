import { BASE_API_URL } from "@/api/index";

export const masterUpdateUrl = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/update`);

export const masterCheckTimetableAvailabilityUrl = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/check-timetable-availability`);

export const masterTimetableUrl = (masterId: number, date: string) =>
  BASE_API_URL.concat(`/master/${masterId}/timetable/${date}`);

export const masterServices = (masterId: number, idSaloon: number) =>
  BASE_API_URL.concat(`/master/${masterId}/services/${idSaloon}`);

export const createMasterServiceInstance = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/services`);

export const cancelMasterServiceInstance = (
  masterId: number,
  serviceInstanceId: number
) =>
  BASE_API_URL.concat(
    `/master/${masterId}/services/${serviceInstanceId}/cancel`
  );
