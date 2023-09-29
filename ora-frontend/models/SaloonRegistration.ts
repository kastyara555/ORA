export interface RegistrationSaloonEmailFormModel {
  email: string;
}

export interface RegistrationSaloonAboutFormModel {
  saloonName: string;
  name: string;
  phone: string;
}

export interface RegistrationSaloonPasswordFormModel {
  password: string;
}

export interface RegistrationSaloonCategoriesFormModel {
  categories: any[];
}

export interface RegistrationSaloonAdressTypeFormModel {
  hasAdress: boolean;
}

export interface RegistrationSaloonAdressFormModel {
  city: any;
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
  pictures: any[];
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
