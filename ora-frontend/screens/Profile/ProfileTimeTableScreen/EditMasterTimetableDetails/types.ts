export interface CreateServiceSaloonModel {
  id: number;
  mainImage: null | string;
  name: string;
}

export interface CreateServiceTimetableModel {
  id: number;
  name: string;
  time: string;
  statusName: string;
  saloon: CreateServiceSaloonModel;
}

export interface CreateServiceServiceModel {
  id: number;
  mainImage: null | string;
  name: string;
}

export interface TimeServiceModel {
  code: string;
  name: string;
}

export interface CreateServiceFormModel {
  saloon: null | CreateServiceSaloonModel;
  service: null | CreateServiceServiceModel;
  hours: TimeServiceModel;
  minutes: TimeServiceModel;
}
