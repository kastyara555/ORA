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
}
