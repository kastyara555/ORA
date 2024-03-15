export interface ClientProfileModel {
  userTypeMapId: number | null;
  userHash: string | null;
  bonusCount: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: string | null;
  userStatus: string | null;
  mainImage: string | null;
  gallery: string[];
}

export interface MasterProfileModel {
  userTypeMapId: number | null;
  userHash: string | null;
  bonusCount: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: string | null;
  userStatus: string | null;
  mainImage: string | null;
  gallery: string[];
  masterDescription: string;
}

export interface SaloonProfileModel {
  userTypeMapId: number | null;
  userHash: string | null;
  bonusCount: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: string | null;
  userStatus: string | null;
  mainImage: string | null;
  gallery: string[];
  saloonName: string | null;
  saloonDescription: string;
  address: ProfileAddressModel | null;
  visitPayment: number | null;
  workingTime: string;
  city: ProfileCityModel | null;
}

export interface ProfileAddressModel {
  streetType: ProfileStreetTypeModel | null;
  street: string;
  building: string;
  stage: string;
  office: string;
}

export interface ProfileStreetTypeModel {
  id: number;
  name: string;
  shortName: string;
}

export interface ProfileCityModel {
  id: number;
  name: string;
}
