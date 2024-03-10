import { BASE_API_URL } from "@/api/index";

export const clientUpdateUrl = (clientId: number) =>
  BASE_API_URL.concat(`/client/${clientId}/update`);
