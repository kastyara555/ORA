export interface ClientProfileModel {
  userTypeMapId: number;
  userHash: string;
  bonusCount: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  userStatus: string;
  mainImage: string | null;
  gallery: string[];
}

export interface MasterProfileModel {
  userTypeMapId: number;
  userHash: string;
  bonusCount: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  userStatus: string;
  mainImage: string | null;
  gallery: string[];
  masterDescription: string;
}

export interface SaloonProfileModel {
  userTypeMapId: number;
  userHash: string;
  bonusCount: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  userStatus: string;
  mainImage: string | null;
  gallery: string[];
  saloonName: string;
  saloonDescription: string;
  address: ProfileAddressModel | null;
  visitPayment: number | null;
  workingTime: string;
  city: ProfileCityModel;
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

export interface ProfileClientHistoryDataModel {
  data: ProfileClientHistoryModel[];
  total: number;
}

export interface ProfileClientHistoryModel {
  id: number;
  date: string;
  procedureName: string;
  statusName: string;
  saloonName: string;
  saloonImage: string | null;
  masterName: string;
  masterImage: string | null;
}
