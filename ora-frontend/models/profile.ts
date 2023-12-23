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
  saloonDescription: string | null;
  address: ProfileAddressModel | null;
  visitPayment: number | null;
  workingTime: any;
  city: ProfileCityModel | null;
}

export interface ProfileAddressModel {
  street: string;
  building: string;
  stage: string;
  office: string;
}

export interface ProfileCityModel {
  id: number;
  name: string;
}
