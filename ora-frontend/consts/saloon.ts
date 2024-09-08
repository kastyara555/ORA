import { range } from "lodash";

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

export const HOURS_SALOON = range(24).map((el: number) => ({
  code: el.toString(),
  name: el.toString(),
}));

export const MINUTES_SALOON = range(12).map((el: number) => {
  const minutes = (el * 5).toString();

  return {
    code: minutes,
    name: minutes,
  };
});
