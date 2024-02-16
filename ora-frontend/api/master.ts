import { BASE_API_URL } from "@/api/index";

export const masterUpdateUrl = (masterId: number) =>
  BASE_API_URL.concat(`/master/${masterId}/update`);
