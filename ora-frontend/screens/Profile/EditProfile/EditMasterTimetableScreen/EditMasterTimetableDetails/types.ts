export interface CreateServiceSaloonModel {
  id: number;
  mainImage: null | string;
  name: string;
}

export interface CreateServiceFormModel {
  saloon: null | CreateServiceSaloonModel;
}
