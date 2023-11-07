import { RegistrationSaloonStoreModel } from "@/store/registrationSaloon/model";
import {
  ABOUT_FORM_INITIAL_STATE,
  ADRESS_FORM_INITIAL_STATE,
  ADRESS_TYPE_FORM_INITIAL_STATE,
  CATEGORIES_FORM_INITIAL_STATE,
  EMAIL_FORM_INITIAL_STATE,
  PASSWORD_FORM_INITIAL_STATE,
  PICTURES_FORM_INITIAL_STATE,
  SERVICES_FORM_INITIAL_STATE,
  STUFF_COUNT_FORM_INITIAL_STATE,
  TIME_FORM_INITIAL_STATE,
  VISIT_PAYMENT_FORM_INITIAL_STATE,
} from "@/consts/registration";

export const initialRegistrationSaloonState: RegistrationSaloonStoreModel = {
  filterValues: {
    categories: [],
    cities: [],
  },
  selectedValues: {
    emailForm: EMAIL_FORM_INITIAL_STATE,
    aboutForm: ABOUT_FORM_INITIAL_STATE,
    passwordForm: PASSWORD_FORM_INITIAL_STATE,
    categoriesForm: CATEGORIES_FORM_INITIAL_STATE,
    adressTypeForm: ADRESS_TYPE_FORM_INITIAL_STATE,
    adressForm: ADRESS_FORM_INITIAL_STATE,
    stuffCountForm: STUFF_COUNT_FORM_INITIAL_STATE,
    visitPaymentForm: VISIT_PAYMENT_FORM_INITIAL_STATE,
    timeForm: TIME_FORM_INITIAL_STATE,
    servicesForm: SERVICES_FORM_INITIAL_STATE,
    picturesForm: PICTURES_FORM_INITIAL_STATE,
  },
  ui: {
    isLoading: false,
  },
};
