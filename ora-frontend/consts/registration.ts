import range from "lodash/range";

import WorkTableModel from "@/models/WorkTableModel";
import {
  RegistrationSaloonAboutFormModel,
  RegistrationSaloonAdressFormModel,
  RegistrationSaloonAdressTypeFormModel,
  RegistrationSaloonCategoriesFormModel,
  RegistrationSaloonEmailFormModel,
  RegistrationSaloonPasswordFormModel,
  RegistrationSaloonPicturesFormModel,
  RegistrationSaloonServicesFormModel,
  RegistrationSaloonStuffCountFormModel,
  RegistrationSaloonTimeFormModel,
  RegistrationSaloonVisitPaymentFormModel,
} from "@/models/SaloonRegistration";

export const STEP_MAPPING = {
  "0": 0,
  "1": 5,
  "2": 10,
  "3": 20,
  "4": 30,
  "5": 50,
  "6": 60,
  "7": 70,
  "8": 80,
  "9": 90,
  "10": 100,
};

export const DEFAULT_WORKING_START_HOURS = 10;
export const DEFAULT_WORKING_START_MINUTES = 0;
export const DEFAULT_WORKING_FINISH_HOURS = 21;
export const DEFAULT_WORKING_FINISH_MINUTES = 0;

export const INITIAL_TIME_TABLE: WorkTableModel = {
  monday: {
    isWorking: true,
    startHour: DEFAULT_WORKING_START_HOURS,
    startMinute: DEFAULT_WORKING_START_MINUTES,
    finishHour: DEFAULT_WORKING_FINISH_HOURS,
    finishMinute: DEFAULT_WORKING_FINISH_MINUTES,
  },
  tuesday: {
    isWorking: true,
    startHour: DEFAULT_WORKING_START_HOURS,
    startMinute: DEFAULT_WORKING_START_MINUTES,
    finishHour: DEFAULT_WORKING_FINISH_HOURS,
    finishMinute: DEFAULT_WORKING_FINISH_MINUTES,
  },
  wednesday: {
    isWorking: true,
    startHour: DEFAULT_WORKING_START_HOURS,
    startMinute: DEFAULT_WORKING_START_MINUTES,
    finishHour: DEFAULT_WORKING_FINISH_HOURS,
    finishMinute: DEFAULT_WORKING_FINISH_MINUTES,
  },
  thursday: {
    isWorking: true,
    startHour: DEFAULT_WORKING_START_HOURS,
    startMinute: DEFAULT_WORKING_START_MINUTES,
    finishHour: DEFAULT_WORKING_FINISH_HOURS,
    finishMinute: DEFAULT_WORKING_FINISH_MINUTES,
  },
  friday: {
    isWorking: true,
    startHour: DEFAULT_WORKING_START_HOURS,
    startMinute: DEFAULT_WORKING_START_MINUTES,
    finishHour: DEFAULT_WORKING_FINISH_HOURS,
    finishMinute: DEFAULT_WORKING_FINISH_MINUTES,
  },
  saturday: {
    isWorking: false,
    startHour: null,
    startMinute: null,
    finishHour: null,
    finishMinute: null,
  },
  sunday: {
    isWorking: false,
    startHour: null,
    startMinute: null,
    finishHour: null,
    finishMinute: null,
  },
};

export const DAY_NAMES_MAPPING = {
  monday: "понедельник",
  tuesday: "вторник",
  wednesday: "среда",
  thursday: "четверг",
  friday: "пятница",
  saturday: "суббота",
  sunday: "воскресенье",
};

export const HOURS = range(25).map((el: number) => ({
  code: el.toString(),
  name: el.toString(),
}));

export const MINUTES = range(60).map((el: number) => ({
  code: el.toString(),
  name: el.toString(),
}));

export const DEFAULT_SERVICE_TO_BE_ADDED = {
  time: {
    hours: { code: "0", name: "0" },
    minutes: { code: "0", name: "0" },
  },
  price: 0,
  category: null,
  procedure: null,
};

export const HOURS_PROCEDURE = range(6).map((el: number) => ({
  code: el.toString(),
  name: el.toString(),
}));

export const MINUTES_PROCEDURE = range(12).map((el: number) => {
  const minutes = (el * 5).toString();

  return {
    code: minutes,
    name: minutes,
  };
});

export const EMAIL_FORM_INITIAL_STATE: RegistrationSaloonEmailFormModel = {
  email: "",
};

export const ABOUT_FORM_INITIAL_STATE: RegistrationSaloonAboutFormModel = {
  phone: "",
  name: "",
  saloonName: "",
};

export const PASSWORD_FORM_INITIAL_STATE: RegistrationSaloonPasswordFormModel =
  {
    password: "",
  };

export const CATEGORIES_FORM_INITIAL_STATE: RegistrationSaloonCategoriesFormModel =
  {
    categories: [],
  };

export const ADRESS_TYPE_FORM_INITIAL_STATE: RegistrationSaloonAdressTypeFormModel =
  {
    hasAdress: true,
  };

export const ADRESS_FORM_INITIAL_STATE: RegistrationSaloonAdressFormModel = {
  city: null,
  street: "",
  building: "",
  stage: "",
  office: "",
};

export const STUFF_COUNT_FORM_INITIAL_STATE: RegistrationSaloonStuffCountFormModel =
  {
    count: 1,
  };

export const VISIT_PAYMENT_FORM_INITIAL_STATE: RegistrationSaloonVisitPaymentFormModel =
  {
    payment: 0,
  };

export const TIME_FORM_INITIAL_STATE: RegistrationSaloonTimeFormModel = {
  timeLine: JSON.stringify(INITIAL_TIME_TABLE),
};

export const SERVICES_FORM_INITIAL_STATE: RegistrationSaloonServicesFormModel =
  {
    services: [],
  };

export const PICTURES_FORM_INITIAL_STATE: RegistrationSaloonPicturesFormModel =
  {
    pictures: [],
  };

