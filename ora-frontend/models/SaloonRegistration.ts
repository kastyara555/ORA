import { ImageListType } from "react-images-uploading";

export interface RegistrationSaloonEmailFormModel {
  email: string;
}

export interface RegistrationSaloonAboutFormModel {
  saloonName: string;
  description: string;
  name: string;
  phone: string;
}

export interface RegistrationSaloonPasswordFormModel {
  password: string;
}

export interface RegistrationSaloonAdressTypeFormModel {
  hasAdress: boolean;
}

export interface RegistrationSaloonAdressFormModel {
  city: any;
  streetType: any;
  street: string;
  building: string;
  stage: string;
  office: string;
}

export interface RegistrationSaloonStuffCountFormModel {
  count: number;
}

export interface RegistrationSaloonVisitPaymentFormModel {
  payment: number;
}

export interface RegistrationSaloonTimeFormModel {
  timeLine: string;
}

export interface RegistrationSaloonServicesFormModel {
  services: any[];
}

export interface RegistrationSaloonPicturesFormModel {
  pictures: ImageListType;
}

export interface SaloonRegistrationServiceModel {
  time: {
    hours: { code: string; name: string };
    minutes: { code: string; name: string };
  };
  price: number;
  procedure: {
    procedureGroupId: number;
    procedureId: number;
    procedureName: string;
  } | null;
}
