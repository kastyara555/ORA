import { BASE_API_URL } from "@/api/index";

export const saloonUpdateUrl = (masterId: number) =>
  BASE_API_URL.concat(`/saloon/${masterId}/update`);

export const getSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/get`);

export const deleteSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/delete`);

export const addSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/add`);

export const getSaloonServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/get`);

export const deleteSaloonServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/delete`);

export const addSaloonServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/add`);
