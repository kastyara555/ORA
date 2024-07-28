import { BASE_API_URL } from "@/api/index";

export const saloonBaseInfoUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}`);

export const saloonInfoServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services`);

export const saloonUpdateUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/update`);

export const getSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/get`);

export const deleteSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/delete`);

export const addSaloonMastersUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/masters/add`);

export const getSaloonServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/get`);

export const addSaloonServicesUrl = (saloonId: number) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/add`);

export const getSaloonServiceDetailsUrl = (
  saloonId: number,
  serviceId: number
) => BASE_API_URL.concat(`/saloon/${saloonId}/services/${serviceId}`);

export const getSaloonServiceUpdateBaseDataUrl = (
  saloonId: number,
  serviceId: number
) => BASE_API_URL.concat(`/saloon/${saloonId}/services/${serviceId}/update`);

export const getSaloonServiceAddMastersUrl = (
  saloonId: number,
  serviceId: number
) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/${serviceId}/addMasters`);

export const getSaloonServiceRemoveMastersUrl = (
  saloonId: number,
  serviceId: number
) =>
  BASE_API_URL.concat(
    `/saloon/${saloonId}/services/${serviceId}/removeMasters`
  );

export const getSaloonServiceUpdateMasterUrl = (
  saloonId: number,
  serviceId: number
) =>
  BASE_API_URL.concat(`/saloon/${saloonId}/services/${serviceId}/updateMaster`);
