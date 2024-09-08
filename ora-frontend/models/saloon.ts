export interface SaloonBaseDataModel {
  id: number;
  name: string;
  description: string;
  cityName: string;
  workingTime: string;
  mainImage: string | null;
  streetType: string | null;
  street: string | null;
  building: string | null;
  stage: string | null;
  office: string | null;
  visitPayment: number;
}

export interface SaloonServiceDataModel {
  data: SaloonServiceModel[];
  total: number;
}

export interface SaloonServiceModel {
  id: number;
  procedureId: number;
  procedureName: string;
}
