import { BASE_API_URL } from "@/api/index";

export const getSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/get`);

export const deleteSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/delete`);

export const addSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/add`);
