import { SaloonServiceDataModel } from "@/models/saloon";

export const DAY_NAMES_MAPPING = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};

export const SALOON_SERVICES_PAGE_SIZE = 16;

export const SALOON_SERVICES_INITIAL_DATA: SaloonServiceDataModel = {
  data: [],
  total: 0,
}
